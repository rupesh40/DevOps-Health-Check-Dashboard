# DevOps Health Check Dashboard - CI/CD Setup  

This project automates testing and deployment using GitHub Actions.  

## **🛠️ Prerequisites**  
- GitHub account  
- Docker Hub account (for storing images)  
- A server with SSH access for deployment (optional)  

## **⚙️ Setup**  

### **1. Configure GitHub Secrets**  
Go to:  
`Settings → Secrets → Actions → New Repository Secret`  

Add these secrets:  
| Name | Value |  
|------|-------|  
| `DOCKER_HUB_USERNAME` | Your Docker Hub username |  
| `DOCKER_HUB_TOKEN` | Docker Hub access token |  
| `SSH_HOST` | `user@your-server-ip` | (optional) 

### **2. How It Works**  
- **When you push code to `main`:**  
  - Tests run (`pytest` + Docker checks)  
  - If tests pass → Docker image is built & deployed  

- **Manual trigger:**  
  - Go to `Actions → CI/CD → Run workflow`  

### **3. Skipping CI**  
Add `[skip ci]` in your commit message to skip automation.  

## **📂 Files Explained**  

### **CI/CD Workflow (`.github/workflows/ci-cd-prod.yml`)**  
- Runs tests  
- Builds & pushes Docker image  
- Deploys to production  

### **Scripts (`scripts/`)**  
| File | Purpose |  
|------|---------|  
| `test-ci.sh` | Runs tests in Docker |  
| `deploy-prod.sh` | Deploys with zero downtime |  
| `wait-for-it.sh` | Waits for app to start |  

### **Docker Files (`docker/`)**  
| File | Purpose |  
|------|---------|  
| `prod/Dockerfile` | Production Docker setup |  
| `prod/docker-compose.yml` | Runs app in production |  

---