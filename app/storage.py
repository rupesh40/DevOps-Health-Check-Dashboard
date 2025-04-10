import json
import os
from app.config import STORAGE_FILE


def load_services():
    """Loads monitored services from the storage file."""
    if not os.path.exists(STORAGE_FILE):
        return []

    with open(STORAGE_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def save_services(services):
    """Saves the list of services to the storage file."""
    with open(STORAGE_FILE, "w") as f:
        json.dump(services, f, indent=2)
