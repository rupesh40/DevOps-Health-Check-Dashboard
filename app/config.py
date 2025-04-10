from dotenv import load_dotenv
import os

load_dotenv()

# Check if running inside Docker
IN_DOCKER = os.environ.get("IN_DOCKER", "0") == "1"

# Use appropriate storage path depending on environment
if IN_DOCKER:
    STORAGE_FILE = "/app/data/checks.json"
else:
    STORAGE_FILE = "./data/checks.json"


FLASK_ENV = os.getenv(
    "FLASK_ENV", "production"
)  # Gets the FLASK_ENV variable, or uses "production" if not found. Prevents errors when .env is missing or incomplete
CHECK_INTERVAL = int(os.getenv("CHECK_INTERVAL", "60"))
# Converts string to number (CHECK_INTERVAL), .env values are strings, but we need an int