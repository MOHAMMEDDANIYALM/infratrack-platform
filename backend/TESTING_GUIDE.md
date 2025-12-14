# InfraTrack - Complete Local Setup & Testing Guide

## 📦 Prerequisites

Before starting, ensure you have:
- **Node.js** 16+ (`node --version`)
- **MongoDB** running locally or connection string
- **Git** (already have if reading this)

### Check Prerequisites

```powershell
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version

# Check if MongoDB is installed
mongod --version

# If MongoDB is not installed, install it:
# Option 1: Using Chocolatey (Windows)
choco install mongodb-community

# Option 2: Download from https://www.mongodb.com/try/download/community
```

---

## 🚀 Quick Start (10 minutes)

### Step 1: Navigate to Project Root
```powershell
cd c:\Users\moham\Desktop\infratrack\infratrack-platform
```

### Step 2: Start MongoDB

**Option A: Local MongoDB Service**
```powershell
# If installed as Windows service, MongoDB starts automatically
# Verify it's running:
netstat -ano | findstr :27017

# If not running, start it:
mongod
# Keep this terminal open - MongoDB must stay running!
```

**Option B: MongoDB Atlas (Cloud - Skip local MongoDB)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `backend/.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/infratrack`

### Step 3: Seed Database (Terminal 1)

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Populate database with demo data
npm run seed

# Expected output:
# ✅ Connected to MongoDB
# 🗑️  Cleared existing data
# ✅ Created admin user
# ✅ Created DevOps user
# ✅ Created Viewer user
# ✅ Created 3 demo servers
# ✅ Created 3 demo logs
# ✅ Created 3 demo alerts
# ✅ Created 4 demo cost records
# ✅ Created 3 demo deployments
# 🎉 Database seeding completed successfully!
# 
# Demo Credentials:
# Organization ID: SA-GOV-001
# Admin: admin@enterprise.sa / admin123
# DevOps: devops@enterprise.sa / admin123
# Viewer: viewer@enterprise.sa / admin123
```

### Step 4: Start Backend Server (Terminal 1)

```powershell
# Still in backend directory
npm run dev

# Expected output:
# 🚀 InfraTrack Backend running on http://localhost:5000
# 📡 Environment: development
```

### Step 5: Start Frontend (Terminal 2)

```powershell
# Navigate to frontend from project root
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
# ➜  press h + enter to show help
```

### Step 6: Test in Browser

1. **Open Browser**: http://localhost:5173
2. **You should see**: Login page with InfraTrack branding
3. **Login with**:
   - Organization ID: `SA-GOV-001`
   - Email: `admin@enterprise.sa`
   - Password: `admin123`
4. **Expected Result**: Dashboard loads with real data from backend

---

## 🧪 Detailed Testing

### Test 1: Authentication Flow

#### Login as Different Roles
```
Test Case 1a: Admin Login
- Org ID: SA-GOV-001
- Email: admin@enterprise.sa
- Password: admin123
- Expected: Dashboard loads with all features visible

Test Case 1b: DevOps Login
- Org ID: SA-GOV-001
- Email: devops@enterprise.sa
- Password: admin123
- Expected: Dashboard loads, can modify servers/logs

Test Case 1c: Viewer Login
- Org ID: SA-GOV-001
- Email: viewer@enterprise.sa
- Password: admin123
- Expected: Dashboard loads, read-only access
```

#### Logout & Session Test
```
Test Case 1d: Logout
- Click "Logout" button
- Expected: Redirected to login page, session cleared

Test Case 1e: Session Persistence
- Login successfully
- Refresh page (F5)
- Expected: Stay logged in, dashboard still shows
```

### Test 2: Dashboard Data

#### Verify Dashboard Loads Real Data
```
Test Case 2a: Dashboard Metrics
- Login and view Dashboard
- Expected to see:
  ✅ Total Servers: 3
  ✅ Total Alerts: 3
  ✅ Average CPU: ~54%
  ✅ Average Memory: ~74%

Test Case 2b: Check Specific Numbers
- Servers: Web Server 1, Database Server, API Server
- Alerts: 3 items (with severities: high, medium, critical)
- Logs: At least 3 entries
- Costs: Total ~38,700 SAR
```

### Test 3: Servers Page

#### List Servers
```
Test Case 3a: View All Servers
- Navigate to Servers page
- Expected: See 3 servers listed
  - Web Server 1 (65% CPU, 72% RAM, running)
  - Database Server (45% CPU, 88% RAM, running)
  - API Server (52% CPU, 64% RAM, running)

Test Case 3b: Server Details
- Click on any server
- Expected: See metrics, status, region details
```

#### Create Server (Admin/DevOps Only)
```
Test Case 3c: Create New Server
- Click "Add Server" button
- Fill in: Name, Hostname, IP Address, CPU %, Memory %, Disk %, Network %
- Click "Create"
- Expected: New server appears in list

Test Case 3d: Viewer Cannot Create
- Login as Viewer
- Navigate to Servers
- Expected: "Add Server" button is disabled/hidden
```

### Test 4: Logs & Filtering

#### View Logs
```
Test Case 4a: View All Logs
- Navigate to Logs page
- Expected: See 3 logs displayed

Test Case 4b: Filter by Type
- Click "Type" filter
- Select "Application"
- Expected: Only application logs shown

Test Case 4c: Filter by Severity
- Click "Severity" filter
- Select "Critical"
- Expected: Only critical severity logs shown

Test Case 4d: Combined Filters
- Filter: Type=Security, Severity=Critical
- Expected: Only logs matching both criteria shown
```

### Test 5: Alerts & Management

#### View Alerts
```
Test Case 5a: View All Alerts
- Navigate to Alerts page
- Expected: See 3 alerts

Test Case 5b: Filter by Severity
- Select "Critical" severity filter
- Expected: Shows 1 critical alert

Test Case 5c: Filter by Status
- Select "Active" status filter
- Expected: Shows 2 active alerts

Test Case 5d: Update Alert Status (Admin Only)
- Click on an alert
- Change status to "Resolved"
- Expected: Status updated, alert removed from active list
```

### Test 6: Cost Monitoring

#### View Costs
```
Test Case 6a: View Cost Breakdown
- Navigate to Cost Monitoring page
- Expected to see:
  ✅ Compute: 15,000 SAR
  ✅ Storage: 8,500 SAR
  ✅ Networking: 3,200 SAR
  ✅ Database: 12,000 SAR
  ✅ Total: 38,700 SAR

Test Case 6b: Service Filter
- Click on a service
- Expected: Cost details for that service show
```

### Test 7: CI/CD Pipeline

#### View Deployments
```
Test Case 7a: View All Deployments
- Navigate to CI/CD page
- Expected: See 3 deployments with statuses
  - One Success in Production
  - One Success in Staging
  - One Running in Dev

Test Case 7b: Filter by Environment
- Filter: Environment = Production
- Expected: Only production deployments shown

Test Case 7c: Filter by Status
- Filter: Status = Running
- Expected: Only running deployments shown
```

---

## 🔌 API Testing (Advanced)

### Using PowerShell to Test Endpoints

```powershell
# ============ AUTHENTICATION ============

# 1. LOGIN
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
Write-Host "User: $($loginResponse.user.name) ($($loginResponse.user.role))"

# ============ DASHBOARD ============

# 2. GET DASHBOARD METRICS
$metrics = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/metrics" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n📊 Dashboard Metrics:"
Write-Host "Total Servers: $($metrics.totalServers)"
Write-Host "Total Alerts: $($metrics.totalAlerts)"
Write-Host "Avg CPU: $($metrics.avgCPU)%"
Write-Host "Avg Memory: $($metrics.avgMemory)%"

# ============ SERVERS ============

# 3. GET SERVERS
$servers = Invoke-RestMethod -Uri "http://localhost:5000/api/servers" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n🖥️  Servers:"
$servers | ForEach-Object { Write-Host "- $($_.name) (CPU: $($_.cpu)%, RAM: $($_.memory)%)" }

# ============ LOGS ============

# 4. GET LOGS (with filters)
$logs = Invoke-RestMethod -Uri "http://localhost:5000/api/logs?type=application&limit=5" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n📋 Logs:"
$logs | ForEach-Object { Write-Host "- $($_.message) ($($_.severity))" }

# ============ ALERTS ============

# 5. GET ALERTS (with filters)
$alerts = Invoke-RestMethod -Uri "http://localhost:5000/api/alerts?severity=critical" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n⚠️  Alerts:"
$alerts | ForEach-Object { Write-Host "- $($_.title) ($($_.severity))" }

# ============ COSTS ============

# 6. GET COSTS
$costs = Invoke-RestMethod -Uri "http://localhost:5000/api/costs" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n💰 Total Costs: $($costs | Measure-Object -Property cost -Sum | Select-Object -ExpandProperty Sum) SAR"

# ============ DEPLOYMENTS ============

# 7. GET DEPLOYMENTS
$deployments = Invoke-RestMethod -Uri "http://localhost:5000/api/deployments" `
  -Method GET `
  -Headers @{Authorization = "Bearer $token"}

Write-Host "`n🚀 Deployments:"
$deployments | ForEach-Object { Write-Host "- $($_.name) - $($_.status)" }
```

---

## ✅ Validation Checklist

After completing all tests, verify:

- [ ] **Authentication**
  - [ ] Login works with all 3 user roles
  - [ ] Logout clears session
  - [ ] Page refresh maintains session
  - [ ] Invalid credentials show error
  - [ ] Token persists in localStorage

- [ ] **Dashboard**
  - [ ] Loads within 2 seconds
  - [ ] Shows correct metrics (3 servers, 3 alerts, etc.)
  - [ ] Numbers match expected values
  - [ ] Charts/graphs display data

- [ ] **Servers**
  - [ ] All 3 servers displayed
  - [ ] Metrics shown correctly (CPU, RAM, Disk, Network)
  - [ ] Admin/DevOps can create/edit servers
  - [ ] Viewer cannot create servers

- [ ] **Logs**
  - [ ] All logs displayed
  - [ ] Filtering by type works
  - [ ] Filtering by severity works
  - [ ] Combined filters work
  - [ ] Pagination works (if > 10 logs)

- [ ] **Alerts**
  - [ ] All alerts displayed
  - [ ] Filtering by severity works
  - [ ] Filtering by status works
  - [ ] Status updates persist
  - [ ] Only Admin can resolve alerts

- [ ] **Costs**
  - [ ] Cost breakdown displayed
  - [ ] Total calculated correctly (38,700 SAR)
  - [ ] Service filter works
  - [ ] Date range filter works (if applicable)

- [ ] **Deployments**
  - [ ] All deployments shown
  - [ ] Environment filter works
  - [ ] Status filter works
  - [ ] Only relevant environments shown

- [ ] **API Endpoints**
  - [ ] All 15+ endpoints responding with 200 OK
  - [ ] Responses have correct data structure
  - [ ] 401 returned for unauthenticated requests
  - [ ] 403 returned for unauthorized roles

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
$env:PORT = 3001
npm run dev
```

### MongoDB Connection Failed

**Problem**: `MongooseError: Cannot connect to MongoDB`

**Solution**:
```powershell
# Check if MongoDB is running
netstat -ano | findstr :27017

# Start MongoDB
mongod

# If MongoDB keeps crashing, check the logs
# Default log location: C:\Program Files\MongoDB\Server\6.0\log
```

### CORS Error in Frontend

**Problem**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
1. Ensure backend is running on `http://localhost:5000`
2. Check `backend/.env` has `FRONTEND_URL=http://localhost:5173`
3. Restart backend server
4. Hard refresh frontend (Ctrl+Shift+R)

### Seed Script Fails

**Problem**: `Error: organizationId: Path `organizationId` is required`

**Solution**:
```powershell
# Delete existing data and try again
# Connect to MongoDB and clear:
# db.users.deleteMany({})
# db.servers.deleteMany({})
# etc.

# Or just run seed again (it clears first):
npm run seed
```

### Frontend Shows "Loading..." Forever

**Problem**: Dashboard gets stuck on loading

**Solution**:
1. Check if backend is running: `http://localhost:5000/health`
2. Check browser console for errors (F12)
3. Verify API URL in `frontend/.env`: `VITE_API_URL=http://localhost:5000/api`
4. Restart frontend: `npm run dev`

### Login Fails with "Invalid Credentials"

**Problem**: Correct credentials still don't work

**Solution**:
```powershell
# Ensure seed script ran successfully
cd backend
npm run seed

# Check MongoDB has users
# Connect to MongoDB and query:
# db.users.find({})

# Should return 3 users with hashed passwords
```

---

## 📊 Expected Demo Data

### Users (3)
```
Organization: SA-GOV-001

1. Mohammed Daniyal
   Email: admin@enterprise.sa
   Role: Admin
   Status: Active

2. Ali Al-Mansouri
   Email: devops@enterprise.sa
   Role: DevOps
   Status: Active

3. Sara Al-Dosari
   Email: viewer@enterprise.sa
   Role: Viewer
   Status: Active

All passwords: admin123
```

### Servers (3)
```
1. Web Server 1
   Status: Running
   CPU: 65% | Memory: 72% | Disk: 58% | Network: 41%
   
2. Database Server
   Status: Running
   CPU: 45% | Memory: 88% | Disk: 72% | Network: 28%
   
3. API Server
   Status: Running
   CPU: 52% | Memory: 64% | Disk: 81% | Network: 35%
```

### Logs (3)
```
1. Application Info - "User login successful"
2. Application Warning - "High memory usage detected"
3. Security Critical - "Failed login attempt detected"
```

### Alerts (3)
```
1. High CPU Usage (Status: Active, Severity: High)
2. Disk Space Low (Status: Acknowledged, Severity: Medium)
3. Service Down (Status: Active, Severity: Critical)
```

### Costs (4)
```
1. Compute: 15,000 SAR
2. Storage: 8,500 SAR
3. Networking: 3,200 SAR
4. Database: 12,000 SAR
Total: 38,700 SAR
```

### Deployments (3)
```
1. Production v2.1.0 - Success
2. Staging v2.1.0-beta - Success
3. Dev v2.2.0 - Running
```

---

## 🎯 Summary

Your InfraTrack platform is now fully set up with:
- ✅ Express backend with all endpoints
- ✅ MongoDB with seed data
- ✅ React frontend with real API integration
- ✅ JWT authentication and role-based access
- ✅ Dashboard with real data from database
- ✅ All features working (servers, logs, alerts, costs, deployments)

### Next Steps

After successful local testing:

1. **Docker Setup**: Create Docker containers for reproducibility
2. **Azure Deployment**: Push to Azure Container Registry and Web App
3. **CI/CD Pipeline**: Set up GitHub Actions for automated deployment
4. **Production Setup**: Use Atlas MongoDB, environment-specific configs

---

**All systems ready for testing!** 🚀
