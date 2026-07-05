import pytest
import jwt
import datetime
from app.config.settings import settings
from app.repositories.user_repo import UserRepository
from app.repositories.farm_repo import FarmRepository
from app.repositories.market_repo import MarketRepository
from app.repositories.scheme_repo import SchemeRepository
from app.repositories.office_repo import OfficeRepository
import uuid

def get_auth_headers(db, email="test_farmer@krishiva.com", role="Farmer") -> dict:
    """Generates a valid test farmer and JWT header."""
    user_id = uuid.uuid4()
    UserRepository.create_user(db, user_id, email, "9876543210", role)
    UserRepository.create_or_update_profile(db, user_id, "Test Ramesh", 5)
    
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "aud": "authenticated",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        "user_metadata": {
            "role": role
        }
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}

def test_dashboard_brief(client, db_session):
    headers = get_auth_headers(db_session)
    res = client.get("/api/v1/dashboard/brief", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "farm_health" in data
    assert "pending_tasks_count" in data

def test_profile_and_farms(client, db_session):
    headers = get_auth_headers(db_session, "profile@krishiva.com")
    
    # 1. Get profile
    res = client.get("/api/v1/profile", headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Test Ramesh"
    
    # 2. Update profile
    put_res = client.put("/api/v1/profile", json={
        "name": "Ramesh Patil",
        "experience_years": 8,
        "bank_account": "1234567890",
        "bank_name": "State Bank of India"
    }, headers=headers)
    assert put_res.status_code == 200
    
    # Verify profile updated
    res2 = client.get("/api/v1/profile", headers=headers)
    assert res2.json()["name"] == "Ramesh Patil"
    assert res2.json()["experience_years"] == 8

    # 3. Register farm field
    farm_res = client.post("/api/v1/profile/farms", json={
        "name": "Sugarcane Zone A",
        "area": "4.5 Acres",
        "soil_type": "Clayey",
        "water_source": "Canal",
        "location": {
            "location_name": "Shirur, Pune",
            "latitude": 18.5204,
            "longitude": 73.8567
        }
    }, headers=headers)
    assert farm_res.status_code == 200
    assert farm_res.json()["success"] is True

    # 4. Get registered farms
    farms_res = client.get("/api/v1/profile/farms", headers=headers)
    assert farms_res.status_code == 200
    assert len(farms_res.json()) == 1
    assert farms_res.json()[0]["name"] == "Sugarcane Zone A"

def test_tasks_checklist(client, db_session):
    headers = get_auth_headers(db_session, "tasks@krishiva.com")
    
    # 1. List seeded tasks
    res = client.get("/api/v1/tasks", headers=headers)
    assert res.status_code == 200
    tasks_list = res.json()
    assert len(tasks_list) > 0
    task_id = tasks_list[0]["id"]
    
    # 2. Toggle task status
    patch_res = client.patch(f"/api/v1/tasks/{task_id}/toggle", headers=headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["is_done"] != tasks_list[0]["is_done"]

    # 3. Create a new task
    post_res = client.post("/api/v1/tasks", json={"text": "Buy urea bags"}, headers=headers)
    assert post_res.status_code == 200
    assert post_res.json()["text"] == "Buy urea bags"
    new_task_id = post_res.json()["id"]

    # 4. Delete task
    del_res = client.delete(f"/api/v1/tasks/{new_task_id}", headers=headers)
    assert del_res.status_code == 200

def test_market_spot_prices_and_negotiation(client, db_session):
    headers = get_auth_headers(db_session, "market@krishiva.com")
    
    # 1. Spot prices list
    res = client.get("/api/v1/market/prices", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) > 0
    
    # 2. Buyers list
    buyers_res = client.get("/api/v1/market/buyers", headers=headers)
    assert buyers_res.status_code == 200
    assert len(buyers_res.json()) > 0
    req_id = buyers_res.json()[0]["id"]
    offered = buyers_res.json()[0]["offeredPrice"]

    # 3. Direct B2B pricing negotiation (Counter offer)
    neg_res = client.post("/api/v1/market/negotiate", json={
        "buyer_request_id": req_id,
        "offered_price": offered,
        "counter_price": int(offered * 1.02), # 2% counter (should be accepted)
        "message": "Direct farm pickup available"
    }, headers=headers)
    assert neg_res.status_code == 200
    assert neg_res.json()["status"] in ["accepted", "countered"]
    neg_id = neg_res.json()["id"]

    # 4. Schedule shipment dispatch
    ship_res = client.post("/api/v1/market/shipment", json={
        "negotiation_id": neg_id,
        "vehicle": "Mahindra Bolero Pickup",
        "pickup_date": "2026-07-10"
    }, headers=headers)
    assert ship_res.status_code == 200

def test_machinery_rentals(client, db_session):
    headers = get_auth_headers(db_session, "machinery@krishiva.com")
    
    # 1. Get machinery list
    res = client.get("/api/v1/machinery", headers=headers)
    assert res.status_code == 200
    list_mach = res.json()
    assert len(list_mach) > 0
    mach_id = list_mach[0]["id"]
    
    # 2. Rent/Book machinery
    book_res = client.post("/api/v1/machinery/book", json={"machinery_id": mach_id}, headers=headers)
    assert book_res.status_code == 200
    assert book_res.json()["status"] == "booked"

def test_government_schemes_matching(client, db_session):
    headers = get_auth_headers(db_session, "schemes@krishiva.com")
    
    # 1. Matching schemes wizard list
    res = client.get("/api/v1/schemes/match", headers=headers)
    assert res.status_code == 200
    list_sch = res.json()
    assert len(list_sch) > 0
    scheme_id = list_sch[0]["id"]
    
    # 2. Apply for subsidy
    apply_res = client.post("/api/v1/schemes/apply", json={
        "scheme_id": scheme_id,
        "submitted_documents": [{"name": "Land Registry Slip", "url": "https://krishiva.com/docs/registry.pdf"}]
    }, headers=headers)
    assert apply_res.status_code == 200
    assert apply_res.json()["status"] == "Pending"

def test_support_offices_locator(client, db_session):
    headers = get_auth_headers(db_session, "offices@krishiva.com")
    
    # 1. Locate RSK Seva offices
    res = client.get("/api/v1/offices", headers=headers)
    assert res.status_code == 200
    list_off = res.json()
    assert len(list_off) > 0
    office_id = list_off[0]["id"]
    
    # 2. Book appointment slot
    book_res = client.post("/api/v1/offices/book", json={
        "office_id": office_id,
        "purpose": "Soil profile analysis consultation",
        "date": "2026-07-08",
        "slot": "11:00 AM - 12:00 PM"
    }, headers=headers)
    assert book_res.status_code == 200
    assert "token_number" in book_res.json()

def test_notifications_alerts(client, db_session):
    headers = get_auth_headers(db_session, "alerts@krishiva.com")
    
    # 1. Fetch alerts
    res = client.get("/api/v1/notifications", headers=headers)
    assert res.status_code == 200
    list_alerts = res.json()
    assert len(list_alerts) > 0
    alert_id = list_alerts[0]["id"]
    
    # 2. Toggle alert read status
    toggle_res = client.post(f"/api/v1/notifications/{alert_id}/toggle", headers=headers)
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_read"] != list_alerts[0]["is_read"]
    
    # 3. Mark all read
    read_all_res = client.post("/api/v1/notifications/read-all", headers=headers)
    assert read_all_res.status_code == 200
    
    # 4. Clear all alerts
    clear_res = client.delete("/api/v1/notifications", headers=headers)
    assert clear_res.status_code == 200

def test_app_settings(client, db_session):
    headers = get_auth_headers(db_session, "settings@krishiva.com")
    
    # 1. Fetch settings config
    res = client.get("/api/v1/settings", headers=headers)
    assert res.status_code == 200
    assert res.json()["theme"] == "system"
    
    # 2. Update configurations
    patch_res = client.patch("/api/v1/settings", json={
        "theme": "dark",
        "language": "hi",
        "font_size": "large"
    }, headers=headers)
    assert patch_res.status_code == 200
    
    # Verify config update
    res2 = client.get("/api/v1/settings", headers=headers)
    assert res2.json()["theme"] == "dark"
    assert res2.json()["language"] == "hi"

def test_assistant_vira_chat(client, db_session):
    headers = get_auth_headers(db_session, "vira@krishiva.com")
    
    # 1. Get history
    res = client.get("/api/v1/assistant/chat", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) > 0
    
    # 2. Chat with Vira
    chat_res = client.post("/api/v1/assistant/chat", json={"message": "Suggest water management for sugarcanes"}, headers=headers)
    assert chat_res.status_code == 200
    assert chat_res.json()["sender"] == "ai"
    assert "sugarcane" in chat_res.json()["text"].lower()

def test_crops_recommendations(client, db_session):
    headers = get_auth_headers(db_session, "crops@krishiva.com")
    
    # Recommendations stepper evaluation
    res = client.post("/api/v1/crops/recommend", json={
        "soilType": "Clayey",
        "waterSource": "High Drip",
        "previousCrop": "Pearl Millet",
        "preferredCategory": "Cash Crop"
      }, headers=headers)
    assert res.status_code == 200
    assert res.json()["success"] is True
    assert len(res.json()["crop_recommendations"]) > 0

def test_disease_scans_history(client, db_session):
    headers = get_auth_headers(db_session, "disease@krishiva.com")
    
    # Scan history listing
    res = client.get("/api/v1/crops/history", headers=headers)
    assert res.status_code == 200
