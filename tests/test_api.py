import pytest
from unittest.mock import patch, mock_open
from datetime import datetime, timezone
from app.api import app


@pytest.fixture
def client():
    app.config["Testing"] = True
    with app.test_client() as client:
        yield client


def test_health_endpoint():
    with app.test_client() as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert "services" in response.get_json()


def test_health_check(client):
    """Test health endpoint with mock services"""
    # Create complete mock data matching your actual service structure
    mock_services = [
        {
            "name": "test",
            "url": "http://test.com",
            "status": "UNKNOWN",
            "last_checked": "None",
        }
    ]

    with patch("app.api.load_services") as mock_load:
        mock_load.return_value = mock_services

        # Make request to endpoint
        response = client.get("/health")

        # Verify response
        assert response.status_code == 200
        assert response.is_json

        # Parse and validate response structure
        data = response.get_json()
        assert isinstance(data, dict)
        assert "services" in data
        assert isinstance(data["services"], list)

        # Verify service data
        assert len(data["services"]) == 1
        service = data["services"][0]
        assert service["name"] == "test"
        assert service["url"] == "http://test.com"
        assert service["status"] in ["UP", "DOWN", "UNKNOWN"]
        assert "last_checked" in service


def test_health_check_multiple_services(client):
    """Test health endpoint with multiple services"""
    mock_services = [
        {
            "name": "service1",
            "url": "http://service1.com",
            "status": "UP",
            "last_checked": datetime.now(timezone.utc).isoformat(),
        },
        {
            "name": "service2",
            "url": "http://service2.com",
            "status": "DOWN",
            "last_checked": datetime.now(timezone.utc).isoformat(),
        },
    ]

    with patch("app.api.load_services") as mock_load:
        mock_load.return_value = mock_services

        response = client.get("/health")
        assert response.status_code == 200
        data = response.get_json()
        assert len(data["services"]) == 2
        assert {s["name"] for s in data["services"]} == {"service1", "service2"}


def test_health_check_storage_error(client):
    """Test health endpoint when storage fails"""
    with patch('app.api.load_services') as mock_load:
        mock_load.side_effect = Exception("Database connection failed")
        
        response = client.get('/health')
        
        assert response.status_code == 500
        assert response.headers['Content-Type'] == 'application/json'
        
        data = response.get_json()
        assert data is not None
        assert 'error' in data
        assert 'Internal server error' in data['error']