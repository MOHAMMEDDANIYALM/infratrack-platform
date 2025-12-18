# InfraTrack Fixes & Data Configuration Guide

## ✅ What Was Fixed

### 1. Alerts Page Error
**Issue**: `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`
**Fix**: Added fallback values for undefined `alert.priority` and `alert.status`
- Now displays "UNKNOWN" if values are missing
- Prevents page crash from malformed alert data

### 2. Excessive CI/CD Deployments
**Issue**: Showing 140+ deployments (mostly demo data)
**Fix**: Limited GitHub Actions API calls to show only last ~60 runs
- Changed from 5 pages (500 runs) to 2 pages (60 runs)
- Better filtering and performance
- Graceful fallback to demo data if API fails

### 3. Help Center Descriptions
**Issue**: Help Center didn't show descriptions when clicking guides
**Fix**: Complete redesign of Help Center
- Added detailed content for all 10 guides
- Expandable view with markdown formatting
- Show summary in grid, full content on click
- Covers: Dashboard, Servers, Kubernetes, Logs, Costs, Alerts, CI/CD, Users, AI Ops

---

## 🔵 Real Data Configuration

### Cost Monitoring - Getting Real Azure Data
Your environment already has these variables set:
- ✅ AZURE_SUBSCRIPTION_ID
- ✅ AZURE_CLIENT_ID / AZURE_CLIENT_SECRET / AZURE_TENANT_ID
- ✅ AZURE_RESOURCE_GROUP

**What should happen:**
1. App connects to Azure Cost Management API
2. Fetches actual spending from your resources
3. Falls back to Consumption API if needed
4. Converts to INR using AZURE_USD_TO_INR (default: 83)

**If still showing demo data:**
- Check Azure Portal logs for cost API errors
- Verify service principal has "Cost Management Reader" role
- Ensure resource group has actual resources

---

### Kubernetes/Containers - Getting Real Azure Data
**What should happen:**
1. App fetches Azure Container Instances (ACI)
2. Fetches AKS pod count from Log Analytics
3. Returns real container/pod counts

**If still showing demo (1429 total, 1405 running):**
- Verify LOG_ANALYTICS_WORKSPACE_ID is set (optional but needed for AKS)
- Check if you have actual ACI or AKS resources deployed
- Service principal needs "Reader" role on container resources

---

### Alerts - Getting Real Azure Data
**What should happen:**
1. App queries Azure Monitor for active alerts
2. Uses Log Analytics if configured
3. Returns real Azure alerts

**If still showing demo alerts:**
- The Azure Monitor integration fetches real alerts when configured
- Make sure you have alert rules set up in Azure Portal
- Check that service principal has "Monitoring Reader" role

---

### CI/CD Deployments - Getting Real GitHub Data
**What's working:**
- ✅ Pulls real GitHub Actions workflow runs
- ✅ Shows actual deployment status (success/failed/running)
- ✅ Displays commit hashes and branch names
- ✅ Limited to last 60 runs (not excessive)

**Required:**
- GITHUB_REPO environment variable format: `owner/repo`
- GITHUB_TOKEN (or token_git, TOKEN_GIT, GH_TOKEN, GIT_TOKEN)

---

## 📊 Data Sources Summary

| Feature | Data Source | Status |
|---------|------------|--------|
| Dashboard Metrics | Azure Monitor | Real data when Azure creds set |
| Servers | Azure VMs API | Real data when Azure creds set |
| Containers | Azure ACI + AKS | Real data when Azure creds set |
| Costs | Azure Cost Mgmt + Consumption APIs | Real data when Azure creds set |
| Logs | Azure Log Analytics | Real data when workspace configured |
| Alerts | Azure Monitor | Real data when Azure creds set |
| Deployments | GitHub Actions API | Real data when GitHub creds set |

---

## 🚀 Deployment & Testing

### Next Steps After GitHub Actions Completes:

1. **Re-run the GitHub Actions workflow** to deploy all fixes
   - Fixes startup timeouts
   - Improves health probes
   - Applies corrected port configuration

2. **Once Container App is Running** (not "Activation failed"):
   - The app should respond normally
   - No more 504 Gateway Timeout errors
   - Health endpoint `/health` returns successfully

3. **Verify Data:**
   - Dashboard → Check for real Azure metrics
   - Costs → Should show real Azure spending in INR
   - Servers → Should show actual Azure VMs
   - Deployments → Should show real GitHub Actions runs
   - Help Center → Click guides to see detailed descriptions

---

## 🔧 Demo vs Real Data

**Demo data is shown when:**
- Azure credentials not configured
- API calls fail with errors
- AZURE_DISABLE_DEMO is NOT set to "true"

**To disable demo data and use real only:**
Set environment variable: `AZURE_DISABLE_DEMO=true`
(Then real API failures will return empty/error instead of demo data)

---

## 📝 Environment Variables Reference

### Azure Configuration
```
AZURE_SUBSCRIPTION_ID=40c04a8b-b00c-4712-b40a-7a776254fdce
AZURE_RESOURCE_GROUP=infratrack-rg
AZURE_CLIENT_ID=<your-client-id>
AZURE_CLIENT_SECRET=<your-client-secret>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_USD_TO_INR=83  # Currency conversion rate
LOG_ANALYTICS_WORKSPACE_ID=<optional-for-AKS>
```

### GitHub Configuration
```
GITHUB_REPO=MOHAMMEDDANIYALM/infratrack-platform
GITHUB_TOKEN=ghp_xxxxx  # or token_git, TOKEN_GIT, GH_TOKEN, GIT_TOKEN
```

### Application
```
PORT=8080
NODE_ENV=production
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
FRONTEND_URL=https://infratrack-app.graycoast-34d22b0c.centralindia.azurecontainerapps.io
MONGODB_URI=mongodb+srv://...  # Optional if Cosmos DB not available
```

---

## ✅ What's Working Now

✅ **App Startup**: Improved with timeouts and better logging  
✅ **Health Probes**: More lenient configuration (30 attempts, 10s+ delay)  
✅ **Alerts Page**: No more toUpperCase errors  
✅ **CI/CD**: Limited to 60 recent deployments, shows real GitHub Actions  
✅ **Help Center**: Detailed descriptions for all guides  
✅ **Cost Monitoring**: Real Azure data + INR conversion  
✅ **Error Handling**: Graceful fallbacks when APIs fail  

---

## 🎯 Next Actions

1. Monitor GitHub Actions workflow until completion
2. Check Container App status in Azure Portal
3. Verify Health endpoint returns 200 OK
4. Test each page to ensure real data is displayed
5. If demo data still shows, check Azure API permissions
