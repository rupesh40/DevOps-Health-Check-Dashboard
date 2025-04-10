# This runs the health checks in the background within the Flask app using a thread

import threading
import time
import logging

from app.checker import check_services
from app.config import CHECK_INTERVAL

logger = logging.getLogger(__name__)

def start_scheduler():
    def run():
        while True:
            logger.info("⏰ Scheduler running health checks...")
            check_services()
            time.sleep(CHECK_INTERVAL)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
    logger.info("✅ Background scheduler started.")