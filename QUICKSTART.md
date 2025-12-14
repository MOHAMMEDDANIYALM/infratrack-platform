# InfraTrack Azure Container Apps Setup - Quick Start

## ✅ What's Been Set Up

1. **Dockerfile** (Node 20 Alpine)
   - Builds frontend (Vite)
   - Bundles backend + frontend into single container
   - Listens on PORT 8080
   - Starts with `npm start`

2. **GitHub Actions CI/CD** (`.github/workflows/deploy-container-app.yml`)
   - Triggers on every push to `main`
   - Builds Docker image
   - Pushes to GitHub Container Registry (GHCR)
   - Auto-deploys to Azure Container Apps

3. **Azure Container Apps Setup**
   - Resource Group: `infratrack-rg` (Central India)
   - Container App Environment: `infratrack-env`
   - Container App: `infratrack-app`
   - Port: 8080
   - Auto-scaling: enabled

4. **Authentication**
   - Email + Password (JWT-based)
   - 1-day token expiration
   - Bcrypt password hashing

---

## 🚀 Quick Deployment Steps

### Step 1: Verify GitHub Actions is Enabled
- Go to your GitHub repo → **Actions** tab
- Confirm workflow `deploy-container-app.yml` is listed
- It will auto-trigger on next push

### Step 2: Azure CLI Setup
```powershell
# Login to Azure
az login
az account set --subscription "40c04a8b-b00c-4712-b40a-7a776254fdce"

# Create Container App Environment (if not exists)
az containerapp env create `
  --name infratrack-env `
  --resource-group infratrack-rg `
  --location centralindia

# Create Container App
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
- `YOUR_GITHUB_PAT` = GitHub Personal Access Token (from GitHub Settings → Developer settings → Personal access tokens)

### Step 3: Configure Secrets & Environment Variables
Via Azure Portal:
1. Go to your Container App → **Secrets**
   - Add: `JWT_SECRET` (32+ char random string)
   - Add: `JWT_REFRESH_SECRET` (32+ char random string)
   - Add: `MONGODB_URI` (your Cosmos DB connection string)

2. Go to **Containers** → Edit → **Environment variables**
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `FRONTEND_URL`: https://infratrack-app.XXXXXXX.centralindia.azurecontainerapps.io

3. Click **Save** → Container will restart

### Step 4: Test
```bash
# Get your app URL
az containerapp show `
  --name infratrack-app `
  --resource-group infratrack-rg `
  --query properties.configuration.ingress.fqdn

# Health check
curl https://YOUR_APP_URL/health

# Register a user
curl -X POST https://YOUR_APP_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "department": "IT",
    "role": "Admin"
  }'

# Login
curl -X POST https://YOUR_APP_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Step 5: Access Frontend
Open in browser:
```
https://YOUR_APP_URL
```

You'll see the InfraTrack login page with **email + password fields**.

---

## 📋 Environment Variables Reference

| Variable | Required | Example | Notes |
|---|---|---|---|
| PORT | No | 8080 | Default |
| NODE_ENV | No | production | Default |
| MONGODB_URI | **YES** | `mongodb+srv://...` | Cosmos DB connection |
| JWT_SECRET | **YES** | 32+ char random | Store in Secrets |
| JWT_REFRESH_SECRET | **YES** | 32+ char random | Store in Secrets |
| FRONTEND_URL | No | https://app.azurecontainerapps.io | For CORS |
| AZURE_SUBSCRIPTION_ID | No | 40c04a8b-... | Optional, for Azure metrics |
| AZURE_RESOURCE_GROUP | No | infratrack-rg | Optional, for Azure metrics |

---

## 🔄 Auto-Deploy on Push

Once GitHub Actions and Container Apps are configured:

```bash
# Make a change and push
echo "# Updated" >> README.md
git add README.md
git commit -m "Update readme"
git push origin main
```

GitHub Actions will:
1. Build Docker image
2. Push to GHCR
3. Deploy to Container Apps (auto-update)

Monitor at: **GitHub repo → Actions → Deploy to Azure Container Apps**

---

## 🛠️ Troubleshooting

### Container won't start
```powershell
# Check logs
az containerapp logs show --name infratrack-app --resource-group infratrack-rg --follow
```

### Health check fails
- Verify `MONGODB_URI` is set and correct
- Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- Check logs for startup errors

### GitHub Actions fails
- Verify `AZURE_CREDENTIALS` secret is added to GitHub
- Check workflow run logs: GitHub repo → Actions

### Login doesn't work
1. Verify container is running: `az containerapp show --name infratrack-app --resource-group infratrack-rg`
2. Test health: `curl https://YOUR_APP_URL/health`
3. Check logs for database connection errors

---

## 📚 Complete Documentation

See `DEPLOYMENT_GUIDE.md` for detailed step-by-step instructions with all CLI commands.

---

## ✨ What's Ready

- ✅ Docker image built and pushed to GHCR on every push
- ✅ Azure Container Apps auto-deployed on main branch push
- ✅ Email + Password authentication (JWT, 1 day expiration)
- ✅ MongoDB/Cosmos DB integration
- ✅ Full frontend + backend in single container
- ✅ Minimal startup logs and non-blocking optional services
- ✅ Production-ready Node 20 Alpine image
- ✅ No unused configs, clean codebase

**Next: Run the Azure CLI commands above, add secrets, and test!**
