from fastapi.testclient import TestClient
from app.main import app


def test_vercel_origin_is_allowed():
    client = TestClient(app)
    response = client.get(
        "/",
        headers={"Origin": "https://krishiva-ohyw6gd19-cabzii-web.vercel.app"},
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://krishiva-ohyw6gd19-cabzii-web.vercel.app"
    assert response.headers.get("access-control-allow-credentials") == "true"
