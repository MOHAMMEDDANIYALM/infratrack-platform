# 🚀 InfraTrack Backend API Setup Guide

## ✅ Completed Backend Implementation

### Core Features Implemented:

#### 1. **Express Server** (`server.js`)
- CORS enabled for frontend (localhost:5173)
- JSON middleware for request parsing
- Error handling middleware
- Health check endpoint

#### 2. **Database Configuration** (`config/database.js`)
- MongoDB connection with Mongoose
- Environment-based connection string
- Error handling on failed connection

#### 3. **Authentication** (`controllers/authController.js`)
- **Login**: Organization ID + Email + Password authentication
- **Register**: New user registration with role assignment
- **Refresh Token**: JWT token refresh mechanism
- **Forgot Password**: Password reset flow
- **Get Me**: Retrieve current user info
- JWT token generation with 1-hour expiry
- Refresh tokens with 7-day expiry
- Password hashing with bcryptjs

#### 4. **Auth Middleware** (`middleware/authMiddleware.js`)
- `protect`: JWT token validation and verification
- `authorize`: Role-based access control (Admin, DevOps, Viewer)

#### 5. **Database Models**
- **User.js**: User schema with organization, role, status
- **Server.js**: Infrastructure server/VM tracking
- **Log.js**: Application, security, and audit logs
- **Alert.js**: Alert management with severity levels
- **Cost.js**: Cloud cost tracking by service
- **Deployment.js**: CI/CD deployment records

#### 6. **Project Controller** (`controllers/projectController.js`)
- Dashboard metrics (servers, alerts, uptime)
- Server CRUD operations
- Log retrieval with filtering
- Alert management
- Cost analytics
- Deployment tracking

#### 7. **Routes**
- **Auth Routes** (`routes/authRoutes.js`):
  - POST `/auth/login`
  - POST `/auth/register`
  - POST `/auth/refresh-token`
  - POST `/auth/forgot-password`
  - GET `/auth/me` (protected)

- **Project Routes** (`routes/projectRoutes.js`):
  - GET `/dashboard/metrics` (protected)
  - GET `/servers` (protected)
  - POST `/servers` (Admin/DevOps only)
  - PUT `/servers/:serverId` (Admin/DevOps only)
  - GET `/logs` (protected, filterable)
  - POST `/logs` (Admin/DevOps only)
  - GET `/alerts` (protected, filterable)
  - PUT `/alerts/:alertId` (protected)
  - GET `/costs` (protected, filterable)
  - GET `/deployments` (protected, filterable)

### 8. **Frontend API Service** (`frontend/src/services/api.js`)
- Axios-like HTTP client with Bearer token support
- Automatic token management
- Error handling with 401 logout
- Pre-configured API methods:
  - `authAPI`: Login, register, refresh token
  - `dashboardAPI`: All dashboard and resource endpoints

### 9. **Environment Configuration**
- Backend `.env`: Port, MongoDB URI, JWT secrets, CORS origin
- Frontend `.env.example`: API URL configuration

---

## 📋 Installation Steps

### Backend Setup:

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (already created)
# Update MONGODB_URI if not using localhost

# Start development server
npm run dev

# Or start production server
npm start
```

### Frontend Setup:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

---

## 🔐 Authentication Flow

### Login Process:
1. Frontend sends: `organizationId`, `email`, `password` to `/auth/login`
2. Backend verifies credentials against database
3. Backend returns: `token`, `refreshToken`, and `user` object
4. Frontend stores tokens in localStorage
5. Frontend sets Authorization header for subsequent requests

### Token Management:
- **Access Token**: 1-hour expiry (used for API requests)
- **Refresh Token**: 7-day expiry (used to get new access token)
- Automatic logout on 401 response

### Role-Based Access Control:
- **Admin**: Full access (create/edit servers, users, etc.)
- **DevOps**: Can manage infrastructure (create logs, servers)
- **Viewer**: Read-only access to monitoring data

---

## 📊 Database Schema

### User Collection:
```json
{
  "organizationId": "SA-GOV-001",
  "name": "User Name",
  "email": "user@example.com",
  "password": "hashed_password",
  "role": "Admin|DevOps|Viewer",
  "department": "Department",
  "status": "active|disabled|pending",
  "lastLogin": "2025-12-08T10:00:00Z"
}
```

### Server Collection:
```json
{
  "organizationId": "SA-GOV-001",
  "name": "Server Name",
  "hostname": "server.example.com",
  "ipAddress": "192.168.1.1",
  "status": "running|stopped|maintenance",
  "region": "us-east-1",
  "cpu": 45,
  "memory": 60,
  "disk": 80,
  "network": 1500,
  "tags": ["production", "critical"]
}
```

---

## 🧪 Testing with Postman

### 1. Login
```
POST http://localhost:5000/api/auth/login
Body:
{
  "organizationId": "SA-GOV-001",
  "email": "admin@enterprise.sa",
  "password": "admin123"
}
```

### 2. Get Dashboard Metrics
```
GET http://localhost:5000/api/dashboard/metrics
Headers:
Authorization: Bearer <token>
```

### 3. Get Servers
```
GET http://localhost:5000/api/servers
Headers:
Authorization: Bearer <token>
```

### 4. Get Logs with Filtering
```
GET http://localhost:5000/api/logs?type=application&severity=error&limit=10
Headers:
Authorization: Bearer <token>
```

---

## 🚨 Important Notes

1. **MongoDB Setup**: Install MongoDB locally or use Atlas cloud MongoDB
2. **JWT Secrets**: Change `JWT_SECRET` in production
3. **CORS**: Update `FRONTEND_URL` to match your frontend domain
4. **Email**: Configure email service for password reset (optional)
5. **Database**: Ensure MongoDB is running before starting backend

---

## 🔧 Next Steps

1. **Seed Demo Data**: Add sample users, servers, logs to database
2. **Docker Setup**: Create Dockerfile and docker-compose.yml
3. **Azure Deployment**: Set up Azure resources and CI/CD pipeline
4. **Testing**: Run Postman tests for all endpoints
5. **WebSocket**: Add real-time metrics using Socket.io

---

## 📞 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Common Response Format
```json
{
  "message": "Success message",
  "data": {},
  "error": "Error message (if failed)"
}
```

### Error Codes
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Server Error

---

**InfraTrack Backend v1.0** | Enterprise Cloud Infrastructure Monitoring Platform
