# 🚀 Azure Real-Time Integration - Deployment Guide

## 📋 Overview

InfraTrack now fetches **REAL-TIME data from Microsoft Azure** instead of using mock data. The dashboard displays live metrics from your Azure resources including VMs, containers, alerts, and network traffic.

---

## ✅ What Was Changed

### Backend Changes

#### **New Files Created:**
1. **`backend/src/services/azureService.js`** - Complete Azure SDK integration
   - Fetches VM metrics (CPU, RAM, Disk, Network)
   - Queries Azure Monitor for real-time data
   - Gets container counts from ACI/AKS
   - Retrieves active alerts
   - Calculates uptime and error rates

2. **`backend/src/controllers/realTimeController.js`** - WebSocket controller
   - Manages Socket.IO connections
   - Broadcasts live metrics every 5 seconds
   - Handles client subscriptions

3. **`backend/src/routes/azureRoutes.js`** - REST API endpoints
   - `/api/azure/metrics` - Aggregated CPU/RAM/Disk/Network
   - `/api/azure/stats` - Dashboard statistics
   - `/api/azure/servers` - Active VM list
   - `/api/azure/alerts` - Active alerts
   - `/api/azure/dashboard` - All data in one request

#### **Modified Files:**
- **`backend/src/server.js`** - Added Socket.IO server integration
- **`backend/package.json`** - Added Azure SDK dependencies
- **`backend/.env`** - Added Azure configuration variables

#### **New NPM Packages Installed:**
```json
{
  "@azure/identity": "^4.x",
  "@azure/monitor-query": "^1.x",
  "@azure/arm-resources": "^5.x",
  "@azure/arm-compute": "^21.x",
  "@azure/arm-containerinstance": "^9.x",
  "@azure/arm-monitor": "^8.x",
  "socket.io": "^4.x"
}
```

---

### Frontend Changes

#### **Modified Files:**
1. **`frontend/src/pages/Dashboard.jsx`**
   - Added Socket.IO client connection
   - Real-time data updates via WebSocket
   - Connection status indicator
   - **UI remains 100% unchanged** ✅

2. **`frontend/.env`**
   - Added `VITE_BACKEND_URL` for WebSocket connection

3. **`frontend/package.json`**
   - Added `socket.io-client` dependency

---

## 🔧 Azure Configuration Required

### Step 1: Get Azure Subscription Details

You need to fill these values in **`backend/.env`**:

```bash
# Get your subscription ID
AZURE_SUBSCRIPTION_ID=

# Get your resource group name (where your VMs/containers are)
AZURE_RESOURCE_GROUP=

# Optional: Log Analytics Workspace ID (for AKS metrics)
LOG_ANALYTICS_WORKSPACE_ID=

# Optional: Application Insights (for error tracking)
APPINSIGHTS_INSTRUMENTATION_KEY=
APPLICATIONINSIGHTS_CONNECTION_STRING=
```

#### How to Get These Values:

**1. Azure Subscription ID:**
```bash
# Using Azure CLI
az account show --query id -o tsv

# Or from Azure Portal:
# Portal > Subscriptions > Copy "Subscription ID"
```

**2. Resource Group Name:**
```bash
# List all resource groups
az group list --query "[].name" -o tsv

# Or from Azure Portal:
# Portal > Resource groups > Select your group > Copy name
```

**3. Log Analytics Workspace ID (Optional):**
```bash
# Get workspace ID
az monitor log-analytics workspace show \
  --resource-group YOUR_RESOURCE_GROUP \
  --workspace-name YOUR_WORKSPACE_NAME \
  --query customerId -o tsv

# Or from Azure Portal:
# Portal > Log Analytics workspaces > Your workspace > Properties > "Workspace ID"
```

**4. Application Insights Keys (Optional):**
```bash
# Get instrumentation key
az monitor app-insights component show \
  --app YOUR_APP_INSIGHTS_NAME \
  --resource-group YOUR_RESOURCE_GROUP \
  --query instrumentationKey -o tsv

# Or from Azure Portal:
# Portal > Application Insights > Your app > Properties
```

---

### Step 2: Azure Authentication Setup

The backend uses **Azure Default Credential** which supports multiple authentication methods:

#### **Option A: Managed Identity (Recommended for Production)**

When deployed to Azure App Service, enable **System Assigned Managed Identity**:

```bash
# Enable Managed Identity for your App Service
az webapp identity assign \
  --name YOUR_APP_SERVICE_NAME \
  --resource-group YOUR_RESOURCE_GROUP

# Get the Principal ID (you'll need this for permissions)
az webapp identity show \
  --name YOUR_APP_SERVICE_NAME \
  --resource-group YOUR_RESOURCE_GROUP \
  --query principalId -o tsv
```

#### **Option B: Azure CLI (For Local Development)**

```bash
# Login to Azure CLI
az login

# Set the subscription
az account set --subscription YOUR_SUBSCRIPTION_ID
```

#### **Option C: Service Principal (Alternative)**

If you need service principal authentication:

```bash
# Create service principal
az ad sp create-for-rbac --name "InfraTrackMonitor" \
  --role "Monitoring Reader" \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID

# Add these to .env:
# AZURE_CLIENT_ID=<appId from output>
# AZURE_CLIENT_SECRET=<password from output>
# AZURE_TENANT_ID=<tenant from output>
```

---

### Step 3: Assign Azure Permissions

The backend needs **READ permissions** to query Azure resources. Assign these roles:

```bash
# Get the identity (Managed Identity Principal ID or Service Principal ID)
IDENTITY_ID="<your-principal-id-here>"
SUBSCRIPTION_ID="<your-subscription-id-here>"

# 1. Monitoring Reader - Read metrics from Azure Monitor
az role assignment create \
  --assignee $IDENTITY_ID \
  --role "Monitoring Reader" \
  --scope /subscriptions/$SUBSCRIPTION_ID

# 2. Reader - Read resource information
az role assignment create \
  --assignee $IDENTITY_ID \
  --role "Reader" \
  --scope /subscriptions/$SUBSCRIPTION_ID

# 3. Log Analytics Reader (if using Log Analytics)
az role assignment create \
  --assignee $IDENTITY_ID \
  --role "Log Analytics Reader" \
  --scope /subscriptions/$SUBSCRIPTION_ID
```

#### Minimum Required Permissions:
- ✅ **Monitoring Reader** - Query Azure Monitor metrics
- ✅ **Reader** - List VMs, containers, and resources
- ✅ **Log Analytics Reader** - Query AKS logs (optional)

---

### Step 4: Azure Resources Required

To see real-time data, you need these Azure resources:

| Resource | Purpose | Student Pack Compatible |
|----------|---------|------------------------|
| **Virtual Machines** | Server monitoring (CPU, RAM, Disk) | ✅ Yes (B-series) |
| **Azure Monitor** | Metrics collection (auto-enabled) | ✅ Yes (Free tier) |
| **Container Instances** | Container count (optional) | ✅ Yes |
| **AKS Cluster** | Kubernetes metrics (optional) | ⚠️ Limited |
| **Log Analytics** | Advanced querying (optional) | ✅ Yes (500 MB/day free) |
| **Application Insights** | Error rate tracking (optional) | ✅ Yes (5 GB/month free) |

#### Minimum Setup (Free):
- **1-2 Virtual Machines** (B1s or B2s)
- **Azure Monitor** (automatically enabled)
- That's it! You'll see real-time VM metrics

---

## 🎯 Deployment Steps

### Local Development

1. **Configure Backend:**
```bash
cd backend

# Edit .env with your Azure details
nano .env

# Install dependencies (already done)
npm install

# Start backend
npm run dev
```

2. **Configure Frontend:**
```bash
cd frontend

# Edit .env
nano .env
# Set: VITE_BACKEND_URL=http://localhost:5000

# Start frontend
npm run dev
```

3. **Test Connection:**
- Open `http://localhost:5173`
- Login with Microsoft account
- Dashboard should show "All Systems Operational - Live Data"
- Check browser console for WebSocket connection logs

---

### Production Deployment (Azure App Service)

#### 1. Deploy Backend to Azure App Service

```bash
# Build and deploy backend
cd backend

# Create Web App (if not exists)
az webapp create \
  --name infratrack-backend \
  --resource-group YOUR_RESOURCE_GROUP \
  --plan YOUR_APP_SERVICE_PLAN \
  --runtime "NODE:18-lts"

# Enable Managed Identity
az webapp identity assign \
  --name infratrack-backend \
  --resource-group YOUR_RESOURCE_GROUP

# Configure environment variables
az webapp config appsettings set \
  --name infratrack-backend \
  --resource-group YOUR_RESOURCE_GROUP \
  --settings \
    AZURE_SUBSCRIPTION_ID="YOUR_SUBSCRIPTION_ID" \
    AZURE_RESOURCE_GROUP="YOUR_RESOURCE_GROUP" \
    NODE_ENV="production"

# Deploy code
az webapp deploy \
  --name infratrack-backend \
  --resource-group YOUR_RESOURCE_GROUP \
  --src-path . \
  --type zip
```

#### 2. Configure WebSocket Support

Azure App Service requires WebSocket to be enabled:

```bash
# Enable WebSockets
az webapp config set \
  --name infratrack-backend \
  --resource-group YOUR_RESOURCE_GROUP \
  --web-sockets-enabled true

# Or from Azure Portal:
# App Service > Configuration > General settings > Web sockets: On
```

#### 3. Update Frontend Environment

```bash
cd frontend

# Edit .env for production
VITE_BACKEND_URL=https://infratrack-backend.azurewebsites.net

# Build frontend
npm run build

# Deploy to backend's public folder
cp -r dist/* ../backend/public/
```

---

## 📊 How It Works

### Data Flow

```
┌──────────────┐
│ Azure Cloud  │
│              │
│ - VMs        │
│ - Containers │
│ - Monitor    │
│ - Alerts     │
└──────┬───────┘
       │
       │ Azure SDK
       ▼
┌──────────────────┐
│ Backend Server   │
│                  │
│ azureService.js  │ ← Queries Azure APIs every 5s
│       │          │
│       ▼          │
│ realTimeController│
│       │          │
│   Socket.IO      │
└───────┬──────────┘
        │
        │ WebSocket
        ▼
┌─────────────────┐
│ Frontend        │
│                 │
│ Dashboard.jsx   │ ← Receives live updates
│                 │
│ (UI unchanged)  │
└─────────────────┘
```

### Update Cycle

1. **Every 5 seconds**, the backend:
   - Queries Azure Monitor for VM metrics
   - Fetches active alerts
   - Gets container counts
   - Calculates aggregated statistics

2. **WebSocket broadcasts** the data to all connected clients

3. **Frontend receives** updates and refreshes the UI without page reload

---

## 🔍 Testing & Verification

### 1. Check WebSocket Connection

Open browser console on dashboard:

```javascript
// Should see:
"Connected to real-time metrics server"

// Every 5 seconds:
"Received dashboard update: {metrics, stats, servers, alerts}"
```

### 2. Test REST APIs

```bash
# Get your access token
TOKEN="<your-jwt-token>"

# Test metrics endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://infratrack-backend.azurewebsites.net/api/azure/metrics

# Test dashboard endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://infratrack-backend.azurewebsites.net/api/azure/dashboard
```

### 3. Verify Azure Queries

Check backend logs:

```bash
# View App Service logs
az webapp log tail \
  --name infratrack-backend \
  --resource-group YOUR_RESOURCE_GROUP

# Should see:
"🚀 InfraTrack Backend running on port 5000"
"🔌 WebSocket server initialized"
"Client connected: <socket-id>"
"Broadcasted metrics to X clients"
```

---

## ❌ Troubleshooting

### Issue: Dashboard shows "Connecting to Azure..."

**Causes:**
- Backend not running
- WebSocket connection blocked
- CORS issues

**Solutions:**
```bash
# 1. Check backend is running
curl https://infratrack-backend.azurewebsites.net/health

# 2. Enable WebSockets on Azure App Service
az webapp config set \
  --name infratrack-backend \
  --resource-group YOUR_RESOURCE_GROUP \
  --web-sockets-enabled true

# 3. Check CORS settings in backend .env
FRONTEND_URL=https://your-frontend-url.com
```

---

### Issue: Azure authentication fails

**Error:** `"DefaultAzureCredential failed to retrieve token"`

**Solutions:**

```bash
# For local development:
az login
az account set --subscription YOUR_SUBSCRIPTION_ID

# For Azure App Service:
# 1. Enable Managed Identity
az webapp identity assign \
  --name infratrack-backend \
  --resource-group YOUR_RESOURCE_GROUP

# 2. Assign permissions
az role assignment create \
  --assignee <principal-id> \
  --role "Monitoring Reader" \
  --scope /subscriptions/YOUR_SUBSCRIPTION_ID
```

---

### Issue: No data showing / Fallback data displayed

**Causes:**
- Azure credentials not configured
- Insufficient permissions
- No Azure resources in subscription

**Check:**
```bash
# Verify you have VMs
az vm list --output table

# Check permissions
az role assignment list \
  --assignee <your-principal-id> \
  --output table

# Test Azure connection from backend
# Backend will log: "Error fetching active servers: <error message>"
```

---

## 🎓 Azure Student Pack Compatibility

All features work with Azure for Students:

| Feature | Free Tier Limit | Notes |
|---------|----------------|-------|
| Virtual Machines | $100 credit | Use B1s/B2s sizes |
| Azure Monitor | Unlimited | Always free |
| Container Instances | Pay per second | Very cheap for testing |
| Log Analytics | 500 MB/day | More than enough |
| Application Insights | 5 GB/month | Plenty for monitoring |

**Estimated Monthly Cost:** $0-10 with free credits

---

## 📝 Summary Checklist

Before going live, ensure:

- [ ] Backend `.env` has Azure Subscription ID
- [ ] Backend `.env` has Resource Group name
- [ ] Azure authentication is configured (CLI or Managed Identity)
- [ ] Permissions assigned (Monitoring Reader + Reader roles)
- [ ] At least 1 VM exists in your subscription
- [ ] WebSockets enabled on Azure App Service
- [ ] Frontend `.env` has correct `VITE_BACKEND_URL`
- [ ] Frontend can connect to backend (check browser console)
- [ ] Dashboard shows "Live Data" connection status

---

## 🆘 Support

### Check Backend Logs
```bash
az webapp log tail --name infratrack-backend --resource-group YOUR_RESOURCE_GROUP
```

### Check Browser Console
Press `F12` > Console tab > Look for WebSocket connection messages

### Test Authentication
```bash
# Verify credentials work
az account show

# Test Azure API access
az vm list --query "[].{Name:name, Status:powerState}" -o table
```

---

## 🎉 Success!

When everything is configured correctly, you'll see:

✅ Dashboard shows "All Systems Operational - Live Data"  
✅ Metrics update every 5 seconds without page reload  
✅ Real VM names and metrics from your Azure subscription  
✅ Actual alerts from Azure Monitor  
✅ Live network traffic data  

**Frontend UI remains completely unchanged - only the data source changed from mock to real Azure APIs!**
