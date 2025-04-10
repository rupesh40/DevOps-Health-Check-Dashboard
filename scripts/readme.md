# How to Test Locally

Run full CI simulation:
```bash
chmod +x scripts/*.sh
./scripts/test-ci.sh
```

Manual verification:
``bash
# Check running services
docker-compose -f docker/prod/docker-compose.yml ps

# View logs
docker-compose -f docker/prod/docker-compose.yml logs -f
```
Test deployment script:
```bash
TAG=test ./scripts/deploy-prod.sh
```