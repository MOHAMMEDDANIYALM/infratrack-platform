# 🚀 InfraTrack Backend-Frontend Integration Guide

## Quick Start (5 minutes)

### Step 1: Ensure MongoDB is Running

**Local MongoDB:**
```powershell
# Check if MongoDB is installed
mongod --version

# If not installed, install via Chocolatey:
choco install mongodb-community

# Start MongoDB service
mongod
# Keep this terminal open - MongoDB must stay running
```

**Or use MongoDB Atlas (Cloud):**
- Create free cluster at https://www.mongodb.com/cloud/atlas
- Copy connection string
- Update `MONGODB_URI` in `backend/.env`

### Step 2: Setup Backend

```powershell
# Terminal 1: Navigate to backend
cd backend

# Install dependencies (if not done)
npm install

# Seed database with demo data
npm run seed

# Expected output:
# ✅ Connected to MongoDB
# ✅ Created admin user
# ✅ Created DevOps user
# ✅ Created Viewer user
# ✅ Created 3 demo servers
# ✅ Created 3 demo logs
# ✅ Created 3 demo alerts
# ✅ Created 4 demo cost records
# ✅ Created 3 demo deployments
# 🎉 Database seeding completed successfully!

# Start backend server
npm run dev

# Expected output:
# 🚀 InfraTrack Backend running on http://localhost:5000
# 📡 Environment: development
```

### Step 3: Setup Frontend

```powershell
# Terminal 2: Navigate to frontend
cd frontend

# Install dependencies (if not done)
npm install

# Ensure .env file exists
If (!(Test-Path .env)) {
  echo "VITE_API_URL=http://localhost:5000/api" | Out-File -Encoding UTF8 .env
}

# Start frontend server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

### Step 4: Test Application

1. **Open Browser**: `http://localhost:5173`
2. **Login** with demo credentials:
   - Organization ID: `SA-GOV-001`
   - Email: `admin@enterprise.sa`
   - Password: `admin123`
3. **Explore Dashboard**: All data loads from MongoDB via backend API

---

## 🧪 Testing the Integration

### Method 1: Browser Testing (Easiest)

1. Open `http://localhost:5173/login`
2. Try different login credentials:
   - **Admin**: `admin@enterprise.sa` / `admin123`
   - **DevOps**: `devops@enterprise.sa` / `admin123`
   - **Viewer**: `viewer@enterprise.sa` / `admin123`
3. Verify dashboard loads with real data
4. Check different pages load data correctly

### Method 2: PowerShell API Testing

```powershell
# ---- LOGIN ----
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Body (@{
    organizationId = "SA-GOV-001"
    email = "admin@enterprise.sa"
    password = "admin123"
  } | ConvertTo-Json) `
  -ContentType "application/json"

$token = $loginResponse.token
Write-Host "✅ Login successful"
Write-Host "Token: $token"
Write-Host "User: $($loginResponse.user.name) ($($loginResponse.user.role))"

# ---- GET DASHBOARD METRICS ----
$metrics = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/metrics" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n📊 Dashboard Metrics:"
$metrics | ConvertTo-Json | Write-Host

# ---- GET SERVERS ----
$servers = Invoke-RestMethod -Uri "http://localhost:5000/api/servers" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n🖥️  Servers:"
$servers | ConvertTo-Json | Write-Host

# ---- GET LOGS ----
$logs = Invoke-RestMethod -Uri "http://localhost:5000/api/logs?type=application&limit=5" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n📋 Logs:"
$logs | ConvertTo-Json | Write-Host

# ---- GET ALERTS ----
$alerts = Invoke-RestMethod -Uri "http://localhost:5000/api/alerts?severity=critical&limit=5" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n⚠️  Alerts:"
$alerts | ConvertTo-Json | Write-Host

# ---- GET COSTS ----
$costs = Invoke-RestMethod -Uri "http://localhost:5000/api/costs" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n💰 Costs:"
$costs | ConvertTo-Json | Write-Host

# ---- GET DEPLOYMENTS ----
$deployments = Invoke-RestMethod -Uri "http://localhost:5000/api/deployments" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n🚀 Deployments:"
$deployments | ConvertTo-Json | Write-Host
```

### Method 3: cURL Testing

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "SA-GOV-001",
    "email": "admin@enterprise.sa",
    "password": "admin123"
  }' | jq .

# Get Dashboard Metrics (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/dashboard/metrics \
  -H "Authorization: Bearer TOKEN" | jq .

# Get Servers
curl -X GET http://localhost:5000/api/servers \
  -H "Authorization: Bearer TOKEN" | jq .

# Get Logs
curl -X GET "http://localhost:5000/api/logs?type=application&limit=5" \
  -H "Authorization: Bearer TOKEN" | jq .
```

---

## 📋 API Endpoints Reference

### Authentication
```
POST   /api/auth/login              ✅ Implemented
POST   /api/auth/register           ✅ Implemented
POST   /api/auth/refresh-token      ✅ Implemented
POST   /api/auth/forgot-password    ✅ Implemented
GET    /api/auth/me                 ✅ Implemented
```

### Dashboard & Resources
```
GET    /api/dashboard/metrics       ✅ Implemented
GET    /api/servers                 ✅ Implemented
POST   /api/servers                 ✅ Implemented (Admin/DevOps)
PUT    /api/servers/:id             ✅ Implemented (Admin/DevOps)
GET    /api/logs                    ✅ Implemented (with filters)
POST   /api/logs                    ✅ Implemented (Admin/DevOps)
GET    /api/alerts                  ✅ Implemented (with filters)
PUT    /api/alerts/:id              ✅ Implemented
GET    /api/costs                   ✅ Implemented (with filters)
GET    /api/deployments             ✅ Implemented (with filters)
```

---

## 🔐 Demo Users

| Email | Password | Role | Org |
|-------|----------|------|-----|
| admin@enterprise.sa | admin123 | Admin | SA-GOV-001 |
| devops@enterprise.sa | admin123 | DevOps | SA-GOV-001 |
| viewer@enterprise.sa | admin123 | Viewer | SA-GOV-001 |

---

## ✅ Integration Checklist

- [x] Backend server running on port 5000
- [x] MongoDB connected and populated
- [x] Authentication working (JWT tokens)
- [x] Frontend API service configured
- [x] Login page integrated with backend
- [x] Dashboard loading real data
- [x] Role-based access control working
- [x] Logout functionality implemented
- [x] Token refresh mechanism in place
- [x] Error handling configured

---

## 🐛 Troubleshooting

### Backend won't start
```
❌ Error: MongoDB connection failed
✅ Solution: Ensure MongoDB is running (mongod in separate terminal)
```

### Login fails with "Invalid credentials"
```
❌ Error: Login fails even with correct credentials
✅ Solution: Run "npm run seed" in backend to populate demo data
```

### Frontend shows CORS error
```
❌ Error: CORS error or "fetch failed"
✅ Solution: 
  1. Ensure backend is running on http://localhost:5000
  2. Check VITE_API_URL in frontend/.env = http://localhost:5000/api
  3. Restart frontend server
```

### API shows 401 Unauthorized
```
❌ Error: API returns 401 even with valid token
✅ Solution: Token may have expired, refresh using refresh-token endpoint
```

### MongoDB shows "Address already in use"
```
❌ Error: mongod says port 27017 is in use
✅ Solution: 
  1. Kill existing mongod process
  2. Or use different port: mongod --port 27018
  3. Update MONGODB_URI accordingly
```

---

## 📊 Demo Data Overview

### Users (3)
- Mohammed Daniyal (Admin)
- Ali Al-Mansouri (DevOps)
- Sara Al-Dosari (Viewer)

### Servers (3)
- Web Server 1 (65% CPU, 72% RAM)
- Database Server (45% CPU, 88% RAM)
- API Server (52% CPU, 64% RAM)

### Logs (3)
- Application info log
- Application warning log
- Security critical log

### Alerts (3)
- High CPU Usage (active)
- Disk Space Low (acknowledged)
- Service Down (active, critical)

### Costs (4)
- Compute: 15,000 SAR
- Storage: 8,500 SAR
- Networking: 3,200 SAR
- Database: 12,000 SAR

### Deployments (3)
- Production v2.1.0 (success)
- Staging v2.1.0-beta (success)
- Dev v2.2.0 (running)

---

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/infratrack
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📈 Next Steps

1. **Test All Endpoints**: Use Postman collection (see API endpoints)
2. **Test Filtering**: Try logs and alerts filters
3. **Test Role-Based Access**: Login as different users
4. **Add More Data**: Use API endpoints to create servers, logs, alerts
5. **Docker Setup**: Containerize for production
6. **Azure Deployment**: Deploy to Azure

---

## 🎯 Success Indicators

✅ All of these should work:
- Login with admin credentials
- Dashboard shows real data from MongoDB
- Servers page displays 3 servers
- Logs page shows logs with filtering
- Alerts page shows active alerts
- Costs page shows expense breakdown
- Deployments page shows deployment records
- Role-based access (try as Viewer)
- Logout clears session

---

**Integration Complete!** 🎉

Your InfraTrack platform is now fully integrated with a working backend. The frontend makes real API calls to the backend, which serves data from MongoDB. Everything is ready for testing and deployment.
