# 🚀 InfraTrack Full Stack Setup

## Prerequisites

- Node.js 16+ installed
- MongoDB 4.4+ (local or Atlas cloud)
- npm or yarn package manager

## Quick Start (5 minutes)

### 1. Setup MongoDB

**Option A: Local MongoDB**
```powershell
# Install MongoDB Community Edition from: https://www.mongodb.com/try/download/community
# Or using Chocolatey:
choco install mongodb-community

# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Copy connection string
4. Update MONGODB_URI in backend/.env
```

### 2. Backend Setup

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start backend
npm run dev

# Expected output:
# 🚀 InfraTrack Backend running on http://localhost:5000
# 📡 Environment: development
# ✅ MongoDB Connected
```

### 3. Frontend Setup (New Terminal)

```powershell
# Navigate to frontend
cd frontend

# Install dependencies (if not done)
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start frontend
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

### 4. Access Application

Open your browser and go to:
```
http://localhost:5173
```

Login with demo credentials:
- **Organization ID**: `SA-GOV-001`
- **Email**: `admin@enterprise.sa`
- **Password**: `admin123`

---

## 📁 Project Structure

```
infratrack-platform/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main server file
│   │   ├── config/
│   │   │   └── database.js        # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── projectController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Server.js
│   │   │   ├── Log.js
│   │   │   ├── Alert.js
│   │   │   ├── Cost.js
│   │   │   └── Deployment.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       └── projectRoutes.js
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── BACKEND_SETUP.md
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── components/
    │   │   └── layout/
    │   ├── pages/
    │   ├── routes/
    │   ├── services/
    │   │   └── api.js              # API client
    │   └── context/
    │       └── AuthContext.jsx
    ├── .env                        # API_URL configuration
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── QUICKSTART.md
```

---

## 🔐 Demo Credentials

### Admin User (Full Access)
- **Organization**: SA-GOV-001 (Saudi Arabia Government)
- **Email**: admin@enterprise.sa
- **Password**: admin123
- **Role**: Admin

### Additional Test Credentials
You can create more users through the registration flow or API:
- Email must be unique per organization
- Password minimum: 8 characters recommended
- Roles: Admin, DevOps, Viewer

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login              - Login with credentials
POST   /api/auth/register           - Create new user account
POST   /api/auth/refresh-token      - Get new access token
POST   /api/auth/forgot-password    - Request password reset
GET    /api/auth/me                 - Get current user info
```

### Dashboard
```
GET    /api/dashboard/metrics       - Real-time system metrics
GET    /api/servers                 - List all servers
POST   /api/servers                 - Create new server (Admin/DevOps)
PUT    /api/servers/:id             - Update server (Admin/DevOps)
GET    /api/logs                    - Get logs with filtering
POST   /api/logs                    - Create log entry (Admin/DevOps)
GET    /api/alerts                  - Get alerts with filtering
PUT    /api/alerts/:id              - Update alert status
GET    /api/costs                   - Get cost data with filtering
GET    /api/deployments             - Get deployment records
```

---

## 🧪 Testing Endpoints

### Using PowerShell
```powershell
# Login and get token
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST -Body (@{
    organizationId = "SA-GOV-001"
    email = "admin@enterprise.sa"
    password = "admin123"
  } | ConvertTo-Json) -ContentType "application/json"

$token = $response.token

# Get dashboard metrics
Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/metrics" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}
```

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "SA-GOV-001",
    "email": "admin@enterprise.sa",
    "password": "admin123"
  }'

# Get metrics (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/dashboard/metrics \
  -H "Authorization: Bearer TOKEN"
```

---

## 🐛 Troubleshooting

### Backend won't start
```
Error: MongoDB connection failed
Solution: Ensure MongoDB is running on localhost:27017
```

### Frontend can't connect to backend
```
Error: Network error or 405 CORS error
Solution: Ensure backend is running on port 5000
          Check VITE_API_URL in frontend/.env
```

### Login fails with "Invalid credentials"
```
Error: Login fails even with correct credentials
Solution: Check MongoDB has sample user data
          Ensure backend .env JWT_SECRET is set
```

### Token expires
```
Token will auto-refresh using refresh token
Manual refresh: GET /api/auth/me
```

---

## 🔄 Development Workflow

### Making Changes

**Backend Changes:**
```powershell
# Changes auto-reload with nodemon
# Just edit and save - backend restarts automatically
npm run dev
```

**Frontend Changes:**
```powershell
# Changes hot-reload with Vite
# Just edit and save - browser updates automatically
npm run dev
```

### Building for Production

**Backend:**
```powershell
# Set NODE_ENV=production in .env
npm start
```

**Frontend:**
```powershell
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📊 Database Seeding (Optional)

Create sample data:
```javascript
// backend/src/seed.js
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await User.create({
    organizationId: 'SA-GOV-001',
    name: 'Admin User',
    email: 'admin@enterprise.sa',
    password: hashedPassword,
    role: 'Admin',
    status: 'active'
  });
};

seedDatabase();
```

Run with:
```powershell
node src/seed.js
```

---

## 🚀 Next Steps

1. **Explore Dashboard**: Check all monitoring features
2. **Create Resources**: Add servers, logs, alerts via API
3. **Test Filtering**: Try log and alert filters
4. **User Management**: Create additional users with different roles
5. **Docker Setup**: Containerize for production deployment
6. **Azure Deployment**: Deploy to Azure App Service

---

## 📞 Support

- Backend Documentation: `/backend/BACKEND_SETUP.md`
- Frontend Guide: `/frontend/QUICKSTART.md`
- API Docs: Full documentation in code comments

---

**Happy Monitoring! 🎉**

*InfraTrack v1.0 | Enterprise Cloud Infrastructure Monitoring*
