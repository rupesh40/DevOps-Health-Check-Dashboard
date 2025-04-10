#!/bin/bash
# Test entire CI/CD pipeline locally

# 1. Build and test
docker-compose -f docker/dev/docker-compose.yml build
docker-compose -f docker/dev/docker-compose.yml up -d
./scripts/wait-for-healthy-container.sh web 60

# 2. Run integration tests
pytest tests/integration/ --cov=app

# 3. Build production image
docker build -f docker/prod/Dockerfile -t health-check:prod .

# 4. Test production deployment
docker-compose -f docker/prod/docker-compose.yml up -d
./scripts/wait-for-healthy-container.sh web_prod 60
curl -v http://localhost:5000/health

# 5. Cleanup
docker-compose -f docker/prod/docker-compose.yml down