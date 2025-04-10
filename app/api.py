from flask import Flask, jsonify, request
from app.storage import load_services, save_services
from app.logger import get_logger
import json

logger = get_logger("api")

app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health_check():
    try:
        services = load_services()
        return jsonify({"services": services})

    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500


@app.route("/services", methods=["POST"])
def add_service():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        name = data.get("name")
        url = data.get("url")

        if not name or not url:
            return jsonify({"error": "Both 'name' and 'url' are required."}), 400

        services = load_services()
        if any(s["name"] == name for s in services):
            return jsonify({"error": f"Service '{name}' already exists."}), 409

        services.append(
            {"name": name, "url": url, "status": "unknown", "last_checked": None}
        )
        save_services(services)
        logger.info(f"Service '{name}' added successfully")
        return jsonify({"message": f"Service '{name}' added successfully."}), 201

    except json.JSONDecodeError:
        logger.error("Invalid JSON data received")
        return jsonify({"error": "Invalid JSON"}), 400
    except KeyError as e:
        logger.error(f"Missing key in data: {e}")
        return jsonify({"error": f"Missing field: {e}"}), 400
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500


@app.route("/services/<string:name>", methods=["DELETE"])
def delete_service(name):
    try:
        services = load_services()
        updated_services = [s for s in services if s["name"] != name]

        if len(services) == len(updated_services):
            logger.warning(f"Service '{name}' not found for deletion")
            return jsonify({"error": f"Service '{name}' not found."}), 404

        save_services(updated_services)
        logger.info(f"Service '{name}' deleted successfully")
        return jsonify({"message": f"Service '{name}' deleted successfully."}), 200

    except Exception as e:
        logger.error(f"Error deleting service: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
