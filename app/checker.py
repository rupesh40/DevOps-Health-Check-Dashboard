import time
import requests
from datetime import datetime, UTC


from app.config import CHECK_INTERVAL
from app.storage import load_services, save_services
from app.logger import get_logger
from app.config import STORAGE_FILE

logger = get_logger("checker")

def check_service(url):
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except requests.RequestException as e:
        logger.Warning(f"⚠️ Error checking {url}:{e}")
        return False


def run_checks():
    logger.info("🔁 Starting service check loop...")

    while True:
        services = load_services()
        logger.info(f"checking {len(services)} services...")

        for service in services:
            name, url = service["name"], service["url"]
            is_up = check_service(url)

            service["status"] = "UP" if is_up else "DOWN"
            service["last_checked"] = datetime.now(UTC).isoformat()

            logger.info(f"{name}: {'✅ UP' if is_up else '❌ DOWN'}")

        save_services(services)
        logger.info(f"Statuses saved. Sleeping for {CHECK_INTERVAL} seconds....\n")
        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    run_checks()
