# Azure Container Registry (ACR) + Container Apps Setup

## Step 1: Create Azure Container Registry

```powershell
# Create ACR named 'infratrackacr'
az acr create `
  --resource-group infratrack-rg `
  --name infratrackacr `
  --sku Basic `
  --location centralindia

# Enable admin credentials (for GitHub Actions authentication)
az acr update `
  --name infratrackacr `
  --admin-enabled true

# Get credentials (SAVE THESE - you'll need them for GitHub Secrets)
az acr credential show `
  --name infratrackacr `
  --resource-group infratrack-rg
```

**Output will show:**
```
{
  "passwords": [
    {
      "name": "password",
      "value": "YOUR_ACR_PASSWORD_HERE"
    },
    {
      "name": "password2",
      "value": "YOUR_ACR_PASSWORD2_HERE"
    }
  ],
  "username": "infratrackacr"
}
```

---

## Step 2: Add GitHub Actions Secrets

Go to **GitHub repo → Settings → Secrets and variables → Actions**

Add two secrets:
- **ACR_USERNAME**: `infratrackacr`
- **ACR_PASSWORD**: [paste the password from above]

---

## Step 3: Create Container App Environment

```powershell
az containerapp env create `
  --name infratrack-env `
  --resource-group infratrack-rg `
  --location centralindia
```

---

## Step 4: Create Container App

```powershell
az containerapp create `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --environment infratrack-env `
  --image infratrackacr.azurecr.io/infratrack-platform:latest `
  --target-port 8080 `
  --ingress external `
  --registry-server infratrackacr.azurecr.io `
  --registry-username infratrackacr `
  --registry-password YOUR_ACR_PASSWORD `
  --cpu 0.25 `
  --memory 0.5Gi
```

Replace `YOUR_ACR_PASSWORD` with the password from Step 1.

---

## Step 5: Get Your Container App URL

```powershell
az containerapp show `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --query properties.configuration.ingress.fqdn -o tsv
```

This will output something like:
```
infratrack-app.agreeablestone-XXXXX.centralindia.azurecontainerapps.io
```

---

## Step 6: Configure Secrets & Environment Variables

Via **Azure Portal:**

1. Go to **Container Apps → infratrack-app → Secrets**
   - Add: `JWT_SECRET` (32+ char random string)
   - Add: `JWT_REFRESH_SECRET` (32+ char random string)
   - Add: `MONGODB_URI` (your Cosmos DB connection string)

2. Go to **Containers** → Edit → **Environment variables**
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `FRONTEND_URL`: https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io

3. Click **Save** → Container will restart

---

## Step 7: Test

```bash
# Health check
curl https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io/health

# Register user
curl -X POST https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "department": "IT",
    "role": "Admin"
  }'

# Login
curl -X POST https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

---

## Step 8: Auto-Deploy on Push

Once everything is set up, just push to main:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

GitHub Actions will automatically:
1. Build Docker image
2. Push to ACR (infratrackacr)
3. Deploy to Container Apps (auto-restart with latest image)

Monitor at: **GitHub repo → Actions → Deploy to Azure Container Apps**

---

## Summary

- **ACR:** infratrackacr.azurecr.io
- **Container App:** infratrack-app
- **Environment:** infratrack-env
- **Region:** Central India
- **Port:** 8080
- **Auto-deploy:** On every push to main branch
