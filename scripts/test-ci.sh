#!/bin/bash
set -e

echo "🔨 Building dev environment..."
docker-compose -f docker/dev/docker-compose.yml build

echo "🧪 Running tests..."
docker-compose -f docker/dev/docker-compose.yml run --rm web pytest tests/ --cov=app

echo "🚀 Testing production build..."
docker build -f docker/prod/Dockerfile -t health-check-test .
TAG=test docker-compose -f docker/prod/docker-compose.yml up -d
./scripts/wait-for-it.sh -t 30 "http://localhost:5000/health"

echo "✅ All tests passed!"
docker-compose -f docker/prod/docker-compose.yml down




# #!/bin/bash
# # Simulates GitHub Actions pipeline locally

# # 1. Test stage
# echo "🚀 Running tests..."
# docker-compose -f docker/dev/docker-compose.yml build
# docker-compose -f docker/dev/docker-compose.yml run --rm web pytest tests/ --cov=app

# # 2. Build production image
# echo "🔨 Building production image..."
# docker build -f docker/prod/Dockerfile -t health-check-ci:test .

# # 3. Verify production setup
# echo "🔍 Testing production deployment..."
# TAG=test docker-compose -f docker/prod/docker-compose.yml up -d
# ./scripts/wait-for-it.sh -t 60 "http://localhost:5000/health"

# # 4. Cleanup
# docker-compose -f docker/prod/docker-compose.yml down
# echo "🎉 CI simulation completed successfully!"