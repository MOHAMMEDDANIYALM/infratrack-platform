# Azure Container Apps Deployment Guide

## Prerequisites
- Azure CLI installed: `az --version`
- Docker installed (for local testing)
- GitHub account with repo access
- Azure subscription

## Step 1: Prepare Your GitHub Repository

### 1.1 Enable GitHub Container Registry (GHCR)
- Push any branch to GitHub (Actions will trigger automatically)
- GHCR will automatically create on first push
- Verify: Go to your repo → Packages → ghcr.io/yourname/infratrack-platform

### 1.2 Create GitHub Personal Access Token (PAT)
1. Go to GitHub Settings → Developer settings → Personal access tokens (classic)
2. Create new token with scopes: `write:packages`, `read:packages`
3. Copy the token (you'll use it to push images)

### 1.3 Push Current Code to Main
```bash
cd c:\Users\moham\Desktop\infratrack\infratrack-platform
git add .
git commit -m "🐳 Add Docker and Container Apps deployment"
git push origin main
```

---

## Step 2: Azure Setup via CLI

### 2.1 Login to Azure
```powershell
az login
az account set --subscription "40c04a8b-b00c-4712-b40a-7a776254fdce"
```

### 2.2 Create Resource Group (if not exists)
```powershell
az group create `
  --name infratrack-rg `
  --location centralindia
```

### 2.3 Create Container App Environment
```powershell
az containerapp env create `
  --name infratrack-env `
  --resource-group infratrack-rg `
  --location centralindia
```

### 2.4 Create Container App
```powershell
az containerapp create `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --environment infratrack-env `
  --image ghcr.io/YOURUSERNAME/infratrack-platform:latest `
  --target-port 8080 `
  --ingress external `
  --registry-server ghcr.io `
  --registry-username YOURUSERNAME `
  --registry-password YOUR_GITHUB_PAT `
  --cpu 0.25 `
  --memory 0.5Gi
```

Replace:
- `YOURUSERNAME` = your GitHub username
- `YOUR_GITHUB_PAT` = the token from Step 2.1

### 2.5 Verify Container App Created
```powershell
az containerapp show `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --query properties.configuration.ingress.fqdn
```

This will output your app URL: `https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io`

---

## Step 3: Configure Environment Variables

### 3.1 Via Azure Portal (Easiest)
1. Go to Azure Portal → Container Apps → infratrack-app
2. Click **Secrets** (for sensitive vars like JWT secrets)
3. Add:
   ```
   JWT_SECRET: your-strong-random-secret-32-chars
   JWT_REFRESH_SECRET: your-strong-random-secret-32-chars
   MONGODB_URI: your-cosmos-db-connection-string
   ```

4. Click **Containers** → Edit your container
5. In **Environment variables**, add:
   ```
   PORT: 8080
   NODE_ENV: production
   FRONTEND_URL: https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io
   ```

6. Optional (for Azure metrics):
   ```
   AZURE_SUBSCRIPTION_ID: 40c04a8b-b00c-4712-b40a-7a776254fdce
   AZURE_RESOURCE_GROUP: infratrack-rg
   ```

7. Click **Save**

### 3.2 Via Azure CLI
```powershell
# Set secrets
az containerapp secret set `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --secrets jwt-secret="your-jwt-secret" `
             jwt-refresh-secret="your-jwt-refresh-secret" `
             mongodb-uri="your-cosmos-db-uri"

# Update container with secrets
az containerapp update `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --set-env-vars `
    PORT=8080 `
    NODE_ENV=production `
    FRONTEND_URL=https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io `
  --secrets `
    JWT_SECRET=secretref:jwt-secret `
    JWT_REFRESH_SECRET=secretref:jwt-refresh-secret `
    MONGODB_URI=secretref:mongodb-uri
```

---

## Step 4: GitHub Actions Secrets Setup

### 4.1 Add Azure Credentials to GitHub
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add secret: `AZURE_CREDENTIALS`
   ```json
   {
     "clientId": "your-app-id",
     "clientSecret": "your-app-secret",
     "subscriptionId": "40c04a8b-b00c-4712-b40a-7a776254fdce",
     "tenantId": "your-tenant-id"
   }
   ```

   To get these, run:
   ```powershell
   az ad sp create-for-rbac `
     --name "infratrack-deployment" `
     --role Owner `
     --scopes /subscriptions/40c04a8b-b00c-4712-b40a-7a776254fdce
   ```

3. The GitHub Actions workflow will automatically:
   - Build the Docker image
   - Push to GHCR
   - Deploy to Container Apps

---

## Step 5: Test the Deployment

### 5.1 Get Your App URL
```powershell
az containerapp show `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --query properties.configuration.ingress.fqdn -o tsv
```

### 5.2 Health Check
```bash
curl https://your-app-url.azurecontainerapps.io/health
```

Expected response:
```json
{"status":"Backend is running ✅"}
```

### 5.3 Test Email+Password Login

**Register a user:**
```bash
curl -X POST https://your-app-url.azurecontainerapps.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "department": "IT",
    "role": "Admin"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "Admin"
  }
}
```

**Login:**
```bash
curl -X POST https://your-app-url.azurecontainerapps.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 5.4 Access the Frontend
Open browser: `https://your-app-url.azurecontainerapps.io`

You should see the InfraTrack login page with email + password form.

---

## Step 6: View Logs

### 6.1 Real-time Logs
```powershell
az containerapp logs show `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --follow
```

### 6.2 Check Container Status
```powershell
az containerapp show `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --query properties.provisioningState
```

---

## Step 7: Update Deployment (Auto via GitHub Actions)

Simply push to main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

GitHub Actions will automatically:
1. Build the Docker image
2. Push to GHCR
3. Deploy to Container Apps

Monitor at: GitHub repo → Actions → Deploy to Azure Container Apps

---

## Troubleshooting

### Container won't start
1. Check logs: `az containerapp logs show --name infratrack-app --resource-group infratrack-rg --follow`
2. Verify env vars: `az containerapp show --name infratrack-app --resource-group infratrack-rg`
3. Common issues:
   - Missing `MONGODB_URI` or `JWT_SECRET` → add via Portal/CLI
   - Port not 8080 → verify in Container Settings
   - Image not found → check GHCR has the image pushed

### GitHub Actions fails
1. Check workflow run: GitHub repo → Actions → Deploy to Azure Container Apps
2. Verify:
   - `AZURE_CREDENTIALS` secret is valid
   - GitHub PAT token has `write:packages` scope
   - Dockerfile builds locally: `docker build -t infratrack:test .`

### Login not working
1. Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
2. Verify `MONGODB_URI` is correct (check Cosmos DB connection)
3. Check logs for auth errors: `az containerapp logs show --name infratrack-app --resource-group infratrack-rg`

---

## Summary

- **App URL:** `https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io`
- **Health Check:** `/health`
- **Login:** `/` (email + password)
- **API:** `/api/auth/login`, `/api/auth/register`
- **Auto-deploy:** Push to `main` branch → GitHub Actions builds & deploys

Email me or check logs if anything fails!
