import httpx
import json

base_url = "http://127.0.0.1:8001"

endpoints = [
    "/",
    "/api/v1/base/health",
    "/api/v1/base/version",
    "/api/v1/base/status",
    "/docs"
]

print("Starting API verification...")
for ep in endpoints:
    url = f"{base_url}{ep}"
    try:
        response = httpx.get(url)
        print(f"\n--- GET {ep} ---")
        print(f"Status Code: {response.status_code}")
        try:
            print(json.dumps(response.json(), indent=2))
        except Exception:
            print(f"Content Preview: {response.text[:200]}...")
    except Exception as e:
        print(f"\n--- GET {ep} FAILED ---")
        print(f"Error: {e}")

print("\n--- CORS Verification ---")
cors_origin = "http://localhost:3000"
headers = {"Origin": cors_origin}
try:
    response = httpx.get(f"{base_url}/", headers=headers)
    print(f"Request Origin: {cors_origin}")
    print(f"Response Status: {response.status_code}")
    print(f"Access-Control-Allow-Origin: {response.headers.get('access-control-allow-origin')}")
    print(f"Access-Control-Allow-Credentials: {response.headers.get('access-control-allow-credentials')}")
    if response.headers.get('access-control-allow-origin') == cors_origin:
        print("[SUCCESS] CORS configured correctly for allowed origin!")
    else:
        print("[FAILED] CORS configuration failed.")
except Exception as e:
    print(f"CORS verification failed: {e}")
