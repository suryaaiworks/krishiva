"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Search, Phone, Mail, Clock, Compass, Calendar, 
  ArrowRight, Star, Navigation, HeartHandshake, PhoneCall,
  User, Check, AlertCircle
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Office {
  id: string;
  name: string;
  type: "seva-kendra" | "kvk" | "soil-lab" | "agri-office";
  district: string;
  block: string;
  address: string;
  distance: string;
  duration: string;
  rating: number;
  status: string;
  hours: string;
  officer: string;
  designation: string;
  phone: string;
  email: string;
  coords: { x: number; y: number };
  directions: string[];
}

const officesDatabase: Office[] = [
  {
    id: "rsk-shirur",
    name: "Rythu Seva Kendra (RSK Shirur)",
    type: "seva-kendra",
    district: "Pune",
    block: "Shirur",
    address: "Opposite Gram Panchayat Office, Shirur Taluka, Pune, Maharashtra - 412210",
    distance: "2.4 km",
    duration: "8 mins",
    rating: 4.8,
    status: "Open Now",
    hours: "9:00 AM - 5:00 PM",
    officer: "Dr. Sanjay Patil",
    designation: "Lead Agronomist & Center Head",
    phone: "+91 98234 56789",
    email: "shirur.rsk@maharashtra.gov.in",
    coords: { x: 120, y: 150 },
    directions: [
      "Start at your Pune farm, head east on Village Road.",
      "Turn right onto NH-60 (Pune-Nashik Highway) after 500m.",
      "Continue straight for 1.5 km past the cooperative dairy.",
      "Turn left at Shirur taluka crossing; RSK Shirur is on your right."
    ]
  },
  {
    id: "kvk-pune",
    name: "Krishi Vigyan Kendra (KVK Pune)",
    type: "kvk",
    district: "Pune",
    block: "Baramati",
    address: "Agricultural Research Station Campus, Baramati, Pune, Maharashtra - 413115",
    distance: "14.2 km",
    duration: "25 mins",
    rating: 4.9,
    status: "Open Now",
    hours: "9:30 AM - 5:30 PM",
    officer: "Dr. Milind Shinde",
    designation: "Senior Soil Scientist",
    phone: "+91 98221 12345",
    email: "kvkpune@icar.org.in",
    coords: { x: 340, y: 220 },
    directions: [
      "Head west towards State Highway 27.",
      "Merge onto SH-27 and drive south towards Baramati for 12 km.",
      "Pass the Agricultural College main gate on your left.",
      "At the roundabout, take the 3rd exit into the KVK Research Campus."
    ]
  },
  {
    id: "soil-lab-pune",
    name: "District Soil & Fertilizer Testing Lab",
    type: "soil-lab",
    district: "Pune",
    block: "Haveli",
    address: "Agriculture College Campus, Shivaji Nagar, Pune, Maharashtra - 411005",
    distance: "8.7 km",
    duration: "18 mins",
    rating: 4.5,
    status: "Open Now",
    hours: "10:00 AM - 4:00 PM",
    officer: "Mrs. Smita Joshi",
    designation: "Chief Chemical Analyst",
    phone: "+91 94220 98765",
    email: "soillab.pune@agri.maharashtra.gov.in",
    coords: { x: 210, y: 80 },
    directions: [
      "Head west on Village Road towards State Highway 27.",
      "Take SH-27 north towards Pune city center for 6 km.",
      "Enter Shivaji Nagar via University Road.",
      "Turn left into Shivaji Nagar Agriculture College campus; Lab is in Block B."
    ]
  },
  {
    id: "agri-dept-shirur",
    name: "Sub-Divisional Agriculture Office",
    type: "agri-office",
    district: "Pune",
    block: "Shirur",
    address: "Tehsil Office Compound, Shirur Taluka, Pune, Maharashtra - 412210",
    distance: "3.1 km",
    duration: "10 mins",
    rating: 4.2,
    status: "Open Now",
    hours: "10:00 AM - 5:30 PM",
    officer: "Mr. Rajendra Thorat",
    designation: "Sub-Divisional Agriculture Officer",
    phone: "+91 94235 67890",
    email: "sdao.shirur@agri.maharashtra.gov.in",
    coords: { x: 150, y: 180 },
    directions: [
      "Head east on Village Road.",
      "Turn right onto NH-60 (Pune-Nashik Highway) after 500m.",
      "Drive for 2.2 km past the state transport stand.",
      "Turn left into the Tehsil Office compound; office is on the ground floor."
    ]
  }
];

interface BookingForm {
  officer: string;
  purpose: string;
  date: string;
  slot: string;
}

export default function OfficesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("Pune");
  const [selectedBlock, setSelectedBlock] = React.useState("Shirur");
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [selectedOfficeId, setSelectedOfficeId] = React.useState<string>("rsk-shirur");
  const [showDirections, setShowDirections] = React.useState(false);
  const [bookingOfficeId, setBookingOfficeId] = React.useState<string | null>(null);
  const [bookingStep, setBookingStep] = React.useState<1 | 2>(1);
  const [isBookingLoading, setIsBookingLoading] = React.useState(false);
  const [offices, setOffices] = React.useState<Office[]>([]);

  // Booking states
  const [bookingForm, setBookingForm] = React.useState<BookingForm>({
    officer: "Dr. Sanjay Patil",
    purpose: "Soil Report Consultation",
    date: "June 28, 2026",
    slot: "Morning (9:00 AM - 11:00 AM)"
  });

  const loadOffices = async () => {
    try {
      const list = await apiClient.get<any[]>("/offices");
      if (list && list.length > 0) {
        setOffices(list.map((o: any) => ({
          id: o.id,
          name: o.name,
          type: o.type,
          district: o.district,
          block: o.block,
          address: o.address,
          distance: o.distance,
          duration: o.duration,
          rating: o.rating,
          status: o.status,
          hours: o.hours,
          officer: o.officer,
          designation: o.designation,
          phone: o.phone,
          email: o.email,
          coords: o.coords,
          directions: o.directions
        })));
      } else {
        setOffices(officesDatabase);
      }
    } catch (err) {
      console.error("Failed to load local offices", err);
      setOffices(officesDatabase);
    }
  };

  React.useEffect(() => {
    loadOffices();
  }, []);

  const activeOffices = offices.length > 0 ? offices : officesDatabase;

  const selectedOffice = activeOffices.find(o => o.id === selectedOfficeId) || activeOffices[0];
  const bookingOffice = activeOffices.find(o => o.id === bookingOfficeId);

  // Filter offices based on state criteria
  const filteredOffices = activeOffices.filter(office => {
    const matchesSearch = office.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          office.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          office.officer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || office.type === activeTab;
    const matchesDistrict = office.district === selectedDistrict;
    
    return matchesSearch && matchesTab && matchesDistrict;
  });

  const handleSelectOffice = (id: string) => {
    setSelectedOfficeId(id);
    setShowDirections(false);
  };

  const handleOpenBooking = (id: string) => {
    const office = activeOffices.find(o => o.id === id);
    if (office) {
      setBookingOfficeId(id);
      setBookingStep(1);
      setBookingForm({
        officer: office.officer,
        purpose: "Soil Report Consultation",
        date: "June 28, 2026",
        slot: "Morning (9:00 AM - 11:00 AM)"
      });
    }
  };

  const handleConfirmBooking = async () => {
    setIsBookingLoading(true);
    try {
      await apiClient.post("/offices/book", {
        office_id: bookingOfficeId,
        purpose: bookingForm.purpose,
        appointment_date: bookingForm.date,
        time_slot: bookingForm.slot
      });
    } catch (err) {
      console.error("Failed to confirm office booking", err);
    } finally {
      setIsBookingLoading(false);
      setBookingStep(2);
    }
  };

  const handleDialNumber = (phone: string, name: string) => {
    alert(`Connecting to ${name}...\nDialing: ${phone}`);
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in">
        
        {/* Page Header */}
        <SectionHeader 
          title="Rythu Seva Kendra & Support Locator" 
          description="Find nearby agricultural support offices, book consultative slots, and access helpline assistance."
          className="mb-0"
        />

        {/* Top Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-card p-4 rounded-card border border-border/60 shadow-sm">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by center name, officer, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-input pl-10 pr-4 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60 transition-all duration-200"
            />
          </div>

          {/* District select */}
          <div className="space-y-1">
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer transition-all duration-200"
            >
              <option value="Pune">Pune District</option>
              <option value="Nagpur">Nagpur District</option>
              <option value="Jalgaon">Jalgaon District</option>
            </select>
          </div>

          {/* Block select */}
          <div className="space-y-1">
            <select 
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer transition-all duration-200"
            >
              <option value="Shirur">Shirur Block (Taluka)</option>
              <option value="Baramati">Baramati Block (Taluka)</option>
              <option value="Haveli">Haveli Block (Taluka)</option>
            </select>
          </div>
        </div>

        {/* Center Type Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-border/40 overflow-x-auto">
          {[
            { id: "all", label: "All Centers" },
            { id: "seva-kendra", label: "Rythu Seva Kendras (RSK)" },
            { id: "kvk", label: "Krishi Vigyan Kendras (KVK)" },
            { id: "soil-lab", label: "Soil Testing Labs" },
            { id: "agri-office", label: "Government Offices" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-btn transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? "bg-primary text-white" 
                  : "bg-card hover:bg-muted/40 text-muted-foreground border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Left Offices List, Right Map & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Offices list (Column span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
              <span>Matching Centers ({filteredOffices.length})</span>
              <span>Sorted by Proximity</span>
            </div>

            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {filteredOffices.map((office) => {
                  const isSelected = office.id === selectedOfficeId;
                  return (
                    <motion.div
                      key={office.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => handleSelectOffice(office.id)}
                      className={`p-5 rounded-card border text-left cursor-pointer transition-all shadow-sm flex flex-col justify-between min-h-[170px] ${
                        isSelected 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border bg-card hover:bg-muted/10"
                      }`}
                    >
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-extrabold text-sm text-foreground tracking-tight line-clamp-1">{office.name}</h4>
                          <Badge className="shrink-0 bg-primary/10 text-primary border-none text-[8.5px] font-extrabold px-2.5 py-0.5">
                            {office.type === "seva-kendra" ? "RSK Center" : office.type === "kvk" ? "KVK Lab" : office.type === "soil-lab" ? "Soil Lab" : "Agri Office"}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-[11px] line-clamp-2">
                          {office.address}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/30 flex justify-between items-center text-[10.5px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span className="font-extrabold text-foreground">{office.distance}</span>
                          <span>({office.duration})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-foreground">{office.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredOffices.length === 0 && (
                <div className="p-8 text-center bg-card border border-border rounded-card space-y-3">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                  <p className="text-xs font-bold text-muted-foreground">No matching centers found in this region.</p>
                  <Button 
                    onClick={() => { setSearchQuery(""); setActiveTab("all"); }} 
                    size="sm" 
                    variant="outline" 
                    className="text-xs rounded-btn bg-card cursor-pointer"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Helpline Section */}
            <div className="bg-gradient-to-tr from-rose-500/10 to-card border border-rose-500/20 p-5 rounded-card space-y-4">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-rose-500 shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">National Agriculture Helplines</h4>
              </div>
              <div className="space-y-3 text-xs leading-normal">
                <div className="flex items-center justify-between bg-card p-3 rounded-btn border border-border/60">
                  <div className="space-y-0.5">
                    <span className="font-bold block">Krishiva Helpline (Toll-Free)</span>
                    <span className="text-[10px] text-muted-foreground">Direct advisory help desk: 1800-180-1551</span>
                  </div>
                  <Button 
                    onClick={() => handleDialNumber("1800-180-1551", "Krishiva Helpline")}
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 bg-primary cursor-pointer shrink-0"
                  >
                    <PhoneCall className="h-4 w-4 text-white" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between bg-card p-3 rounded-btn border border-border/60">
                  <div className="space-y-0.5">
                    <span className="font-bold block">Agri Disaster Response Desk</span>
                    <span className="text-[10px] text-muted-foreground">Emergency block officer: 1921</span>
                  </div>
                  <Button 
                    onClick={() => handleDialNumber("1921", "Agri Disaster response desk")}
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 bg-primary cursor-pointer shrink-0"
                  >
                    <PhoneCall className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Selected Office Details, Map and Booking (Column span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Map Preview widget */}
            <Card title="" animate={false} className="p-5 overflow-hidden relative min-h-[350px] flex flex-col justify-between">
              
              {/* Map Controls */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <Badge variant="outline" className="font-bold bg-primary/10 text-primary border-none py-1">
                  GPS Active
                </Badge>
                {showDirections && (
                  <Badge variant="outline" className="font-bold bg-card border border-border py-1">
                    Route Active ({selectedOffice.distance})
                  </Badge>
                )}
              </div>

              {/* Custom SVG Map Visualization */}
              <div className="h-64 w-full bg-emerald-50/40 dark:bg-emerald-950/10 rounded-card relative overflow-hidden border border-border/30 flex items-center justify-center">
                
                {/* SVG Drawing of terrain grid */}
                <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <path d="M 0 50 L 400 50 M 0 100 L 400 100 M 0 150 L 400 150 M 0 200 L 400 200 M 0 250 L 400 250" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-border" />
                  <path d="M 50 0 L 50 300 M 100 0 L 100 300 M 150 0 L 150 300 M 200 0 L 200 300 M 250 0 L 250 300 M 300 0 L 300 300 M 350 0 L 350 300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-border" />
                  
                  {/* Main Roads */}
                  <path d="M 30 0 Q 80 120 150 180 T 360 220" stroke="#E2E8F0" strokeWidth="6" className="dark:stroke-muted/40" />
                  <path d="M 120 0 Q 150 80 210 80 T 380 300" stroke="#CBD5E1" strokeWidth="4" className="dark:stroke-muted/20" />
                  
                  {/* Farm boundaries */}
                  <rect x="30" y="80" width="40" height="30" rx="3" fill="#2E7D32" fillOpacity="0.08" stroke="#2E7D32" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="35" y="72" className="fill-emerald-700 dark:fill-emerald-400 font-bold text-[8px]">Pune Farm</text>

                  {/* Route connecting Farm to selected office */}
                  {showDirections && (
                    <motion.path 
                      d={`M 50 95 L 80 120 L ${selectedOffice.coords.x} ${selectedOffice.coords.y}`}
                      stroke="#2E7D32" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ strokeDasharray: "1000", strokeDashoffset: "1000" }}
                      animate={{ strokeDashoffset: "0" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  )}
                </svg>

                {/* Blinking pin for User Location (Pune Farm) */}
                <div className="absolute top-[90px] left-[45px] flex items-center justify-center">
                  <span className="absolute h-7 w-7 rounded-full bg-primary/20 border border-primary/30 kv-ping-slow" />
                  <span className="absolute h-4 w-4 rounded-full bg-primary/30 animate-pulse" />
                  <div className="relative h-3 w-3 rounded-full bg-primary border-2 border-white shadow-md" />
                </div>

                {/* Office locations pins */}
                {filteredOffices.map((office) => {
                  const isSelected = office.id === selectedOfficeId;
                  return (
                    <div 
                      key={office.id} 
                      className="absolute cursor-pointer transition-all duration-300 hover:scale-110 flex flex-col items-center"
                      style={{ top: office.coords.y - 12, left: office.coords.x - 12 }}
                      onClick={() => handleSelectOffice(office.id)}
                    >
                      <div className="relative flex items-center justify-center">
                        {isSelected && (
                          <span className="absolute h-9 w-9 rounded-full bg-primary/20 border border-primary/30 animate-ping pointer-events-none" />
                        )}
                        <MapPin className={`h-6 w-6 relative z-10 ${isSelected ? "text-primary fill-primary/10 drop-shadow-md" : "text-muted-foreground/60"}`} />
                      </div>
                      {isSelected && (
                        <div className="absolute -top-6 bg-card border border-border px-2 py-0.5 rounded-btn shadow-sm text-[8px] font-bold text-foreground whitespace-nowrap z-20">
                          {office.distance}
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>

              {/* Show selected center's basic info & directions toggle */}
              <div className="space-y-4 pt-3 text-xs leading-normal">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Selected Support Office</span>
                    <h3 className="text-base font-extrabold text-foreground">{selectedOffice.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => setShowDirections(!showDirections)}
                      variant={showDirections ? "default" : "outline"} 
                      className={`text-xs font-bold px-4 h-9 rounded-btn cursor-pointer ${
                        showDirections ? "bg-primary text-white" : "bg-card text-foreground"
                      }`}
                    >
                      <Navigation className="mr-1.5 h-4 w-4 shrink-0" />
                      {showDirections ? "Hide Route" : "Get Directions"}
                    </Button>
                    <Button 
                      onClick={() => handleOpenBooking(selectedOffice.id)}
                      className="text-xs font-bold px-4 h-9 rounded-btn cursor-pointer bg-primary text-white"
                    >
                      <Calendar className="mr-1.5 h-4 w-4 shrink-0" />
                      Book Slot
                    </Button>
                  </div>
                </div>

                {/* Animated Directions Panel */}
                <AnimatePresence>
                  {showDirections && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-3 bg-muted/40 p-4 rounded-card border border-border/50"
                    >
                      <h5 className="font-bold text-xs text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                        <Compass className="h-4.5 w-4.5 text-primary" />
                        Driving Route Directions ({selectedOffice.distance})
                      </h5>
                      <div className="space-y-2 text-[11px] text-muted-foreground pl-1">
                        {selectedOffice.directions.map((step, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <span className="font-extrabold text-primary shrink-0">{index + 1}.</span>
                            <p>{step}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </Card>

            {/* Office Contact Info & Timing Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Contact Details */}
              <Card title="" animate={false} className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <User className="h-5 w-5 text-primary shrink-0" />
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Officer Contact Details</h4>
                </div>
                
                <div className="space-y-3 text-xs leading-normal">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-foreground text-sm block">{selectedOffice.officer}</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{selectedOffice.designation}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/30 text-muted-foreground text-[11px]">
                    <div 
                      onClick={() => handleDialNumber(selectedOffice.phone, selectedOffice.officer)}
                      className="flex items-center gap-2.5 cursor-pointer hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>{selectedOffice.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <span className="break-all">{selectedOffice.email}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 2: Operations and Timings */}
              <Card title="" animate={false} className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Operating Timings</h4>
                </div>
                
                <div className="space-y-3 text-xs leading-normal">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-muted-foreground">Office Timing:</span>
                    <strong className="text-foreground">{selectedOffice.hours}</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-muted-foreground">Weekly Offs:</span>
                    <strong className="text-foreground">Sundays & Public Holidays</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-muted-foreground">Status:</span>
                    <Badge className="font-bold bg-primary text-white border-none text-[10px] px-2.5 py-0.5 animate-pulse">
                      {selectedOffice.status}
                    </Badge>
                  </div>

                  <p className="text-[10px] text-muted-foreground/80 pt-2 border-t border-border/30">
                    * Visitors are advised to pre-book a consultative token slot online to avoid long queues during peak farming hours.
                  </p>
                </div>
              </Card>

            </div>

          </div>

        </div>

        {/* APPOINTMENT BOOKING DIALOG/WIZARD MODAL */}
        <AnimatePresence>
          {bookingOfficeId && bookingOffice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg bg-card rounded-dialog border border-border p-6 shadow-2xl space-y-5"
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-3 border-b border-border/50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Consultative Appointment</span>
                    <h3 className="text-lg font-extrabold text-foreground leading-snug">{bookingOffice.name}</h3>
                  </div>
                  <Button 
                    onClick={() => setBookingOfficeId(null)}
                    variant="outline" 
                    className="h-8 w-8 rounded-full p-0 bg-card cursor-pointer border border-border text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>

                {/* STEP 1: FORM INPUT */}
                {bookingStep === 1 && (
                  <div className="space-y-4 text-xs leading-normal">
                    
                    {/* Select Officer */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground">Select Agricultural Specialist</label>
                      <select 
                        value={bookingForm.officer}
                        onChange={(e) => setBookingForm({ ...bookingForm, officer: e.target.value })}
                        className="w-full bg-muted/20 border border-border rounded-btn px-3 h-10 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                      >
                        <option value={bookingOffice.officer}>{bookingOffice.officer} ({bookingOffice.designation.split(" & ")[0]})</option>
                        <option value="Er. Ramesh Rao">Er. Ramesh Rao (Irrigation Specialist)</option>
                        <option value="Mrs. Shalini Deshmukh">Mrs. Shalini Deshmukh (Subsidies Coordinator)</option>
                      </select>
                    </div>

                    {/* Purpose of Visit */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground">Purpose of Appointment</label>
                      <select 
                        value={bookingForm.purpose}
                        onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                        className="w-full bg-muted/20 border border-border rounded-btn px-3 h-10 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                      >
                        <option value="Soil Report Consultation">Soil Report Consultation</option>
                        <option value="Fertilizer Subsidy Application">Fertilizer Subsidy Application</option>
                        <option value="Disease Diagnosis Guidance">Disease Diagnosis Guidance</option>
                        <option value="Solar Pump Grant Query">Solar Pump Grant Query</option>
                        <option value="Seed Selection Advisory">Seed Selection Advisory</option>
                      </select>
                    </div>

                    {/* Choose Date */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground block">Select Date</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { date: "June 28, 2026", label: "Tomorrow", avail: "5 slots left" },
                          { date: "June 29, 2026", label: "Mon, Jun 29", avail: "12 slots left" },
                          { date: "June 30, 2026", label: "Tue, Jun 30", avail: "8 slots left" }
                        ].map((d) => (
                          <div 
                            key={d.date}
                            onClick={() => setBookingForm({ ...bookingForm, date: d.date })}
                            className={`p-2.5 rounded-btn border text-center cursor-pointer transition-all ${
                              bookingForm.date === d.date 
                                ? "border-primary bg-primary/5 text-primary" 
                                : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                            }`}
                          >
                            <span className="font-bold block text-[11px]">{d.label}</span>
                            <span className="text-[9px] text-muted-foreground/80 mt-0.5 block">{d.avail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Choose Slot */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-foreground block">Select Time Slot</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          "Morning (9:00 AM - 11:00 AM)",
                          "Mid-Day (11:00 AM - 1:00 PM)",
                          "Afternoon (2:00 PM - 5:00 PM)"
                        ].map((slot) => (
                          <div 
                            key={slot}
                            onClick={() => setBookingForm({ ...bookingForm, slot: slot })}
                            className={`p-2.5 rounded-btn border text-left cursor-pointer transition-all ${
                              bookingForm.slot === slot 
                                ? "border-primary bg-primary/5 text-primary" 
                                : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                            }`}
                          >
                            <span className="font-bold text-[11px] block">{slot}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-3">
                      <Button 
                        onClick={() => setBookingOfficeId(null)}
                        variant="outline" 
                        className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-card"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleConfirmBooking}
                        disabled={isBookingLoading}
                        className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-primary text-white"
                      >
                        {isBookingLoading ? (
                          <>
                            Securing Token...
                            <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full ml-1.5 shrink-0" />
                          </>
                        ) : (
                          <>
                            Confirm Booking
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>

                  </div>
                )}

                {/* STEP 2: BOOKING SUCCESS RECEIPT */}
                {bookingStep === 2 && (
                  <div className="space-y-5 text-center text-xs leading-normal py-4">
                    {/* Animated green check circle */}
                    <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                      <Check className="h-8 w-8 stroke-[3.5]" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-lg font-black text-foreground">Appointment Confirmed!</h4>
                      <p className="text-muted-foreground px-4 text-[11px]">
                        Your queue token has been secured successfully. Present this digital ticket at the center reception.
                      </p>
                    </div>

                    {/* Ticket details card */}
                    <div className="border border-border/80 rounded-card p-4 bg-muted/30 text-left space-y-3.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 bg-primary/10 rounded-bl-card border-l border-b border-border/30 text-[9.5px] font-extrabold text-primary uppercase tracking-widest">
                        Token Secured
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Ticket Reference</span>
                        <strong className="text-sm font-extrabold text-foreground block">TKT-2026-98124</strong>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 text-[11px] pt-1">
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">Officer</span>
                          <span className="font-bold text-foreground">{bookingForm.officer}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">Token Number</span>
                          <span className="font-extrabold text-primary text-sm">No. 14</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 text-[11px] pt-1">
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">Schedule</span>
                          <span className="font-bold text-foreground">{bookingForm.date}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">Time Slot</span>
                          <span className="font-bold text-foreground truncate block">{bookingForm.slot.split(" (")[0]}</span>
                        </div>
                      </div>

                      {/* Mock QR Code SVG */}
                      <div className="pt-3 border-t border-border/30 flex justify-between items-center gap-4">
                        <div className="space-y-0.5 text-[10.5px]">
                          <span className="text-muted-foreground block text-[9.5px] font-bold uppercase">Estimated wait</span>
                          <span className="font-extrabold text-foreground">12 minutes</span>
                        </div>
                        <div className="h-14 w-14 border border-border bg-white p-1 rounded-btn shrink-0 flex items-center justify-center">
                          <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                            {/* Simple QR representation lines */}
                            <rect x="1" y="1" width="6" height="6" />
                            <rect x="2" y="2" width="4" height="4" fill="black" />
                            <rect x="17" y="1" width="6" height="6" />
                            <rect x="18" y="2" width="4" height="4" fill="black" />
                            <rect x="1" y="17" width="6" height="6" />
                            <rect x="2" y="18" width="4" height="4" fill="black" />
                            <path d="M 10 2 L 14 2 M 10 5 L 14 5 M 10 10 L 14 10 L 14 14 L 10 14 Z M 18 10 L 22 10 M 18 14 L 22 14 M 10 18 L 14 18 M 18 18 L 22 18" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        onClick={() => setBookingOfficeId(null)}
                        className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-primary text-white"
                      >
                        Done & Close
                      </Button>
                      <Button 
                        onClick={() => alert("Appointment ticket receipt saved as PDF.")}
                        variant="outline"
                        className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-card border border-border text-foreground"
                      >
                        Download Ticket
                      </Button>
                    </div>

                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}
