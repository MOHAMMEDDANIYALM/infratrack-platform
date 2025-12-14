# 🎯 QUICK START - Azure Configuration

## Copy These Commands

### 1️⃣ Get Subscription ID
```bash
az account show --query id -o tsv
```
**➡️ Paste into:** `backend/.env` → `AZURE_SUBSCRIPTION_ID=`

---

### 2️⃣ Get Resource Group
```bash
az group list --query "[].name" -o tsv
```
**➡️ Choose one and paste into:** `backend/.env` → `AZURE_RESOURCE_GROUP=`

---

### 3️⃣ Get Managed Identity Principal ID
```bash
az webapp identity show \
  --name infratrack-backend \
  --resource-group <YOUR_RESOURCE_GROUP> \
  --query principalId -o tsv
```
**➡️ Save this - you'll need it for permissions**

---

### 4️⃣ Assign Permissions

Replace `PRINCIPAL_ID` and `SUBSCRIPTION_ID` with your values:

```bash
# Monitoring Reader role
az role assignment create \
  --assignee PRINCIPAL_ID \
  --role "Monitoring Reader" \
  --scope /subscriptions/SUBSCRIPTION_ID

# Reader role
az role assignment create \
  --assignee PRINCIPAL_ID \
  --role "Reader" \
  --scope /subscriptions/SUBSCRIPTION_ID
```

---

### 5️⃣ Enable WebSockets
```bash
az webapp config set \
  --name infratrack-backend \
  --resource-group <YOUR_RESOURCE_GROUP> \
  --web-sockets-enabled true
```

---

### 6️⃣ Update App Service Settings
```bash
az webapp config appsettings set \
  --name infratrack-backend \
  --resource-group <YOUR_RESOURCE_GROUP> \
  --settings \
    AZURE_SUBSCRIPTION_ID="<from step 1>" \
    AZURE_RESOURCE_GROUP="<from step 2>"
```

---

### 7️⃣ Restart App Service
```bash
az webapp restart \
  --name infratrack-backend \
  --resource-group <YOUR_RESOURCE_GROUP>
```

---

## ✅ Verification

### Check if it's working:
```bash
# View logs
az webapp log tail \
  --name infratrack-backend \
  --resource-group <YOUR_RESOURCE_GROUP>

# Should see:
# "🔌 WebSocket server initialized"
# "Client connected: ..."
# "Broadcasted metrics to X clients"
```

### Open Dashboard:
- Go to: https://infratrack-backend.azurewebsites.net
- Login with Microsoft account
- Should see: "All Systems Operational - Live Data" ✅

---

## 🆘 If Not Working

### Check Authentication:
```bash
# Verify you're logged in
az account show

# List your VMs (backend needs to do this)
az vm list --output table
```

### Check Permissions:
```bash
# List role assignments for your Managed Identity
az role assignment list \
  --assignee PRINCIPAL_ID \
  --output table
```

### Check Logs:
```bash
# Real-time logs
az webapp log tail \
  --name infratrack-backend \
  --resource-group <YOUR_RESOURCE_GROUP>

# Look for errors like:
# "Error fetching active servers: ..."
# "DefaultAzureCredential failed..."
```

---

## 📊 Expected Results

Once configured:

✅ Dashboard connects via WebSocket  
✅ Shows real VM names from your Azure subscription  
✅ Updates CPU/RAM/Disk every 5 seconds  
✅ Displays actual alerts from Azure Monitor  
✅ Connection status: "Live Data"  

---

## 📄 Full Documentation

- **`AZURE_INTEGRATION_SUMMARY.md`** - What changed & overview
- **`AZURE_REALTIME_SETUP.md`** - Complete setup guide with troubleshooting

---

That's it! Just fill in the Azure IDs and run the commands above. 🚀
