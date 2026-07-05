-- Krishiva Supabase PostgreSQL Database Schema Migration
-- Phase 2A Production Setup

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. users Table (Links to auth.users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('Farmer', 'Admin', 'Buyer', 'Machinery Owner', 'Field Officer')) DEFAULT 'Farmer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own record" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System/Admin can do all" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- ==========================================
-- 2. farmer_profiles Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    verified_id TEXT,
    bank_account TEXT,
    bank_name TEXT,
    certification_status TEXT CHECK (certification_status IN ('Pending', 'Verified', 'Rejected')) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view own profile" ON public.farmer_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Farmers can update own profile" ON public.farmer_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins/Officers can view all profiles" ON public.farmer_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Admin', 'Field Officer')
        )
    );

-- ==========================================
-- 3. farms Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    water_source TEXT NOT NULL,
    current_crop TEXT,
    health_score INTEGER DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own farms" ON public.farms
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Officers/Admins can view all farms" ON public.farms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Admin', 'Field Officer')
        )
    );

-- ==========================================
-- 4. farm_locations Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.farm_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE UNIQUE NOT NULL,
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.farm_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own farm locations" ON public.farm_locations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.farms WHERE id = farm_id AND user_id = auth.uid()
        )
    );

-- ==========================================
-- 5. crops Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    season TEXT NOT NULL CHECK (season IN ('kharif', 'rabi', 'zaid', 'Annual')),
    water_requirement TEXT,
    soil_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_crops_farm_id ON public.crops(farm_id);
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own crops" ON public.crops
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.farms WHERE id = farm_id AND user_id = auth.uid()
        )
    );

-- ==========================================
-- 6. crop_health Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.crop_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE UNIQUE NOT NULL,
    health_score INTEGER NOT NULL DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    growth_stage TEXT NOT NULL,
    water_level TEXT NOT NULL,
    disease_risk TEXT NOT NULL,
    ai_confidence DOUBLE PRECISION NOT NULL CHECK (ai_confidence BETWEEN 0.0 AND 1.0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.crop_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crop health data" ON public.crop_health
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.farms WHERE id = farm_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "System/Admins can write crop health" ON public.crop_health
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Admin', 'Field Officer')
        )
    );

-- ==========================================
-- 7. weather_forecasts Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.weather_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES public.farm_locations(id) ON DELETE CASCADE NOT NULL,
    temperature_c DOUBLE PRECISION NOT NULL,
    feels_like_c DOUBLE PRECISION NOT NULL,
    humidity_pct DOUBLE PRECISION NOT NULL CHECK (humidity_pct BETWEEN 0 AND 100),
    wind_speed_kph DOUBLE PRECISION NOT NULL,
    rain_prob_pct DOUBLE PRECISION NOT NULL CHECK (rain_prob_pct BETWEEN 0 AND 100),
    uv_index INTEGER NOT NULL CHECK (uv_index >= 0),
    condition TEXT NOT NULL,
    forecast_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_weather_location ON public.weather_forecasts(location_id, forecast_date);
ALTER TABLE public.weather_forecasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to weather data" ON public.weather_forecasts
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to weather data" ON public.weather_forecasts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- ==========================================
-- 8. market_prices Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name TEXT UNIQUE NOT NULL,
    current_price INTEGER NOT NULL CHECK (current_price >= 0),
    yesterday_price INTEGER NOT NULL CHECK (yesterday_price >= 0),
    weekly_change TEXT NOT NULL,
    monthly_change TEXT NOT NULL,
    trend TEXT CHECK (trend IN ('up', 'down', 'stable')) NOT NULL,
    demand TEXT NOT NULL,
    supply TEXT NOT NULL,
    confidence TEXT NOT NULL,
    next_week_price INTEGER NOT NULL CHECK (next_week_price >= 0),
    next_month_price INTEGER NOT NULL CHECK (next_month_price >= 0),
    reasoning TEXT NOT NULL,
    decision TEXT CHECK (decision IN ('Hold', 'Sell Now', 'Wait')) NOT NULL,
    decision_reason TEXT NOT NULL,
    expected_diff TEXT NOT NULL,
    risk TEXT NOT NULL,
    buyers JSONB NOT NULL DEFAULT '[]'::jsonb,
    mandis JSONB NOT NULL DEFAULT '[]'::jsonb,
    insights JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to market prices" ON public.market_prices
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to market prices" ON public.market_prices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- ==========================================
-- 9. buyer_requests Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.buyer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    crop_required TEXT NOT NULL,
    quantity_required TEXT NOT NULL,
    offered_price INTEGER NOT NULL CHECK (offered_price >= 0),
    unit TEXT NOT NULL,
    distance TEXT NOT NULL,
    distance_val DOUBLE PRECISION NOT NULL,
    pickup_available BOOLEAN NOT NULL DEFAULT true,
    payment_method TEXT NOT NULL,
    expected_payment_time TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    certification TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_buyer_requests_crop ON public.buyer_requests(crop_required);
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to buyer requests" ON public.buyer_requests
    FOR SELECT USING (true);

CREATE POLICY "Buyers can manage own requests" ON public.buyer_requests
    FOR ALL USING (
        auth.uid() = buyer_id OR 
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- ==========================================
-- 10. marketplace Table (B2B Negotiations)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.marketplace (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    buyer_request_id UUID REFERENCES public.buyer_requests(id) ON DELETE CASCADE NOT NULL,
    offered_price INTEGER NOT NULL CHECK (offered_price >= 0),
    counter_price INTEGER NOT NULL CHECK (counter_price >= 0),
    status TEXT CHECK (status IN ('idle', 'submitting', 'accepted', 'countered', 'declined')) DEFAULT 'idle',
    compromise_offer INTEGER,
    message TEXT,
    vehicle TEXT,
    pickup_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_marketplace_user ON public.marketplace(user_id);
ALTER TABLE public.marketplace ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own B2B bids" ON public.marketplace
    FOR ALL USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.buyer_requests b WHERE b.id = buyer_request_id AND b.buyer_id = auth.uid()
        )
    );

-- ==========================================
-- 11. machinery Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.machinery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price_rate TEXT NOT NULL,
    distance TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT CHECK (status IN ('available', 'rented', 'maintenance')) DEFAULT 'available',
    rating TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.machinery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to machinery list" ON public.machinery
    FOR SELECT USING (true);

CREATE POLICY "Owners can manage machinery" ON public.machinery
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Machinery Owner', 'Admin')
        )
    );

-- ==========================================
-- 12. machinery_bookings Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.machinery_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machinery_id UUID REFERENCES public.machinery(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'booked',
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.machinery_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own machinery bookings" ON public.machinery_bookings
    FOR ALL USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- ==========================================
-- 13. government_schemes Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.government_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    benefit TEXT NOT NULL,
    eligibility_score TEXT NOT NULL,
    deadline TEXT NOT NULL,
    approval_time TEXT NOT NULL,
    priority TEXT NOT NULL,
    description TEXT NOT NULL,
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to schemes" ON public.government_schemes
    FOR SELECT USING (true);

CREATE POLICY "Allow admins to edit schemes" ON public.government_schemes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- ==========================================
-- 14. scheme_applications Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.scheme_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID REFERENCES public.government_schemes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    submitted_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can manage own applications" ON public.scheme_applications
    FOR ALL USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Admin', 'Field Officer')
        )
    );

-- ==========================================
-- 15. notifications Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'info')),
    category TEXT NOT NULL CHECK (category IN ('weather', 'pest', 'market', 'scheme', 'relief')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    date TEXT NOT NULL,
    action_label TEXT,
    action_href TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE is_read = false;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 16. daily_tasks Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.daily_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks" ON public.daily_tasks
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 17. ai_recommendations Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    query TEXT NOT NULL,
    recommendations JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations" ON public.ai_recommendations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can write recommendations" ON public.ai_recommendations
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 18. conversation_history Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.conversation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations" ON public.conversation_history
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 19. voice_sessions Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.voice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    language TEXT NOT NULL,
    audio_url TEXT,
    transcript TEXT,
    ai_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own voice sessions" ON public.voice_sessions
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 20. uploaded_images Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.uploaded_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    bucket_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own images" ON public.uploaded_images
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 21. uploaded_documents Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.uploaded_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    bucket_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.uploaded_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents" ON public.uploaded_documents
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 22. settings Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'system',
    font_size TEXT DEFAULT 'medium',
    voice_enabled BOOLEAN DEFAULT true,
    offline_mode BOOLEAN DEFAULT false,
    biometrics_enabled BOOLEAN DEFAULT false,
    pin_lock_enabled BOOLEAN DEFAULT false,
    notifications_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings" ON public.settings
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 23. activity_logs Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own logs" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System writes logs" ON public.activity_logs
    FOR INSERT WITH CHECK (true);

-- ==========================================
-- 24. support_offices Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.support_offices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('seva-kendra', 'kvk', 'soil-lab', 'agri-office')),
    district TEXT NOT NULL,
    block TEXT NOT NULL,
    address TEXT NOT NULL,
    distance TEXT NOT NULL,
    duration TEXT NOT NULL,
    rating DOUBLE PRECISION NOT NULL CHECK (rating BETWEEN 0.0 AND 5.0),
    status TEXT NOT NULL,
    hours TEXT NOT NULL,
    officer TEXT NOT NULL,
    designation TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    coords JSONB NOT NULL,
    directions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.support_offices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of support offices" ON public.support_offices
    FOR SELECT USING (true);

CREATE POLICY "Allow admin edit support offices" ON public.support_offices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- ==========================================
-- office_bookings Table (Helper Join for offices)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.office_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    office_id UUID REFERENCES public.support_offices(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    purpose TEXT NOT NULL,
    date TEXT NOT NULL,
    slot TEXT NOT NULL,
    token_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.office_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own office bookings" ON public.office_bookings
    FOR ALL USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Admin', 'Field Officer')
        )
    );

-- ==========================================
-- Triggers to automatically sync auth.users with public.users
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, phone, role)
    VALUES (
        new.id,
        new.email,
        new.phone,
        COALESCE(new.raw_user_meta_data->>'role', 'Farmer')
    );
    
    INSERT INTO public.settings (user_id)
    VALUES (new.id);
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
