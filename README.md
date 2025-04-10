# DevOps Health Check Dashboard

![Architecture Diagram](./diagrams/architecture.png)

A production-ready monitoring solution for DevOps teams to track service health statuses.

## Features

- REST API for managing monitored services
- Background health check scheduler
- JSON storage (with file locking)
- Docker-ready implementation
- Comprehensive logging

## Quick Start

### Local Development

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate    # Windows

pip install -r requirements.txt
python -m app.run

```

# Docker Deployment
```bash
docker-compose up --build
```

### API Documentation
Endpoint	      Method	Description
/health	          GET	    Get current health status
/services	      POST	    Add new service
/services/<name>  DELETE	Remove service

CLI Usage
```bash
# List services
python cli.py list

# Add service
python cli.py add "Service Name" "http://service.url"
```

# Configuration
Environment variables in .env:
```bash
FLASK_ENV=production
CHECK_INTERVAL=60
IN_DOCKER=0
```

## Testing
```bash
pytest tests/
```