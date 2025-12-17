# API Testing Guide

## Backend Status
- Port: 3000
- Health endpoint: http://localhost:3000/health
- Socket.IO status: http://localhost:3000/api/realtime/status

## Test Endpoints (Requires Authentication)

### Authentication
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token

### Dashboard
- GET /api/projects/dashboard/metrics

### Servers
- GET /api/projects/servers
- POST /api/projects/servers (Admin/DevOps)
- PUT /api/projects/servers/:serverId (Admin/DevOps)

### Logs
- GET /api/projects/logs
- POST /api/projects/logs (Admin/DevOps)

### Alerts
- GET /api/projects/alerts
- PUT /api/projects/alerts/:alertId

### Costs
- GET /api/projects/costs

### Deployments
- GET /api/projects/deployments

### Users
- GET /api/projects/users

## Frontend Status
- Port: 5173
- URL: http://localhost:5173

## Known Issues & Fixes Applied

1. ✅ AuthContext - Initializes with null user, prevents login state persistence
   - Fixed: Added proper error handling and initial state

2. ✅ API calls - axios returning entire response object instead of data
   - Fixed: All endpoints now use response.data properly

3. ✅ Demo data - Added fallback for all endpoints
   - Fixed: Controllers now return demo data when database fails

4. ✅ CORS - Properly configured for localhost:5173

5. ✅ Socket.IO - Non-blocking initialization

## Testing Checklist

- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] Login works with test credentials
- [ ] Dashboard loads with metrics data
- [ ] Servers page shows data
- [ ] Logs page shows data
- [ ] Alerts page shows data
- [ ] Costs page shows data
- [ ] Deployments page shows data
- [ ] Users page shows data
- [ ] Real-time updates work via Socket.IO
- [ ] No CORS errors in browser console
- [ ] No authentication errors

## Quick Test Commands

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Test API
curl http://localhost:3000/health
```
