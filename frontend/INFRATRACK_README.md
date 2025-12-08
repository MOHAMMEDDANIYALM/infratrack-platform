# InfraTrack - Enterprise Cloud Infrastructure Monitor

## 🚀 Overview

InfraTrack is a high-tech enterprise-grade cloud infrastructure monitoring platform designed for professional DevOps engineers and organizations. Built with React, Vite, and Tailwind CSS, it provides real-time monitoring, AI-powered insights, and comprehensive management tools.

## ✨ Features

### 1. **Secure Professional Login System**
- Organization ID / Company Code authentication
- Professional email and password login
- Forgot password functionality
- Request access page for new users
- Account disabled screen
- Role-based access control (Admin, DevOps, Viewer)
- No public registration - enterprise only

### 2. **Real-Time Dashboard**
- Live CPU, RAM, Disk, Network metrics
- Active servers and containers count
- System uptime percentage
- Error rate monitoring
- Auto-refresh system (5-second intervals)
- Animated glowing alert widgets

### 3. **Server & Cloud Management**
- VM list with real-time status
- Start/Stop/Restart controls
- Server resource monitoring (CPU, RAM, Disk)
- Multi-region support
- Server health indicators

### 4. **Kubernetes Management**
- Cluster health monitoring
- Node status and metrics
- Pod management and monitoring
- Restart count tracking
- Container logs access

### 5. **Logs & Audit System**
- Application logs
- Security logs
- Access audit logs
- Filter by date, severity, user, type
- Real-time log streaming
- Search functionality

### 6. **Cost & Usage Monitoring**
- Daily and monthly cloud cost tracking
- Service-wise cost breakdown
- Cost anomaly detection
- Budget usage monitoring
- AI-powered optimization suggestions
- Potential savings calculator

### 7. **Alerts & Notifications**
- High CPU alerts
- Server down notifications
- Budget exceeded warnings
- Unauthorized access alerts
- Real-time notification panel
- Alert acknowledgment and resolution

### 8. **CI/CD Pipeline Monitoring**
- GitHub commit tracking
- Build and pipeline status
- Deployment history
- Rollback options
- Success rate monitoring
- Pipeline health dashboard

### 9. **User & Access Management**
- Create and disable users
- Role assignment (Admin, DevOps, Viewer)
- Track user activities
- Password reset functionality
- User status management

### 10. **Comprehensive Help & Support System**
- Dedicated Help Center page
- Step-by-step user guides
- Searchable knowledge base
- FAQ section
- Support ticket submission with file upload
- System status and uptime monitoring
- Incident history tracking

### 11. **AI Ops Intelligence** (Future Ready)
- Failure prediction (24-48 hours ahead)
- Anomaly detection with confidence scores
- Smart scaling recommendations
- Cost optimization by AI
- Resource usage pattern analysis

## 🎨 UI Design

- **Professional dark theme** with cyan/blue accent colors
- **Sidebar + Topbar layout** for easy navigation
- **Fully responsive** design for all screen sizes
- **Modern animated effects** (floating, pulsing, glowing)
- **Enterprise-grade appearance** (no student-style design)
- **Saudi government-style** professional look
- **Gradient accents** and glassmorphism effects

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔐 Demo Credentials

Use these credentials to login:

- **Organization ID:** SA-GOV-001
- **Email:** admin@enterprise.sa
- **Password:** admin123

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.jsx         # Navigation sidebar
│   │       ├── Topbar.jsx          # Top navigation bar
│   │       └── MainLayout.jsx      # Main layout wrapper
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── ForgotPassword.jsx      # Password reset
│   │   ├── RequestAccess.jsx       # Access request form
│   │   ├── AccountDisabled.jsx     # Account disabled screen
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── Servers.jsx             # Server management
│   │   ├── Kubernetes.jsx          # K8s management
│   │   ├── Logs.jsx                # Logs viewer
│   │   ├── CostMonitoring.jsx      # Cost tracking
│   │   ├── Alerts.jsx              # Alert management
│   │   ├── CICD.jsx                # CI/CD pipeline
│   │   ├── Users.jsx               # User management
│   │   ├── AIops.jsx               # AI operations
│   │   └── HelpCenter.jsx          # Help & support
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── routes/
│   │   └── AppRoutes.jsx           # Route configuration
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── tailwind.config.js               # Tailwind configuration
├── vite.config.js                   # Vite configuration
└── README.md                        # This file
```

## 🛠️ Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Heroicons** - Beautiful icon set
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🔥 Key Features Implementation

### Real-Time Updates
The dashboard automatically updates metrics every 5 seconds using `setInterval`:
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    // Update metrics
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

### Role-Based Access Control
Three user roles with different permissions:
- **Admin** - Full system access
- **DevOps** - Infrastructure management
- **Viewer** - Read-only access

### Responsive Design
All pages are fully responsive using Tailwind CSS breakpoints:
- Mobile: `sm:` (640px+)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Large Desktop: `xl:` (1280px+)

## 🎯 Usage Guide

### Navigation
Use the sidebar to navigate between different sections:
- Dashboard - Real-time overview
- Servers & Cloud - Manage VMs
- Kubernetes - Monitor clusters
- Logs & Audit - View system logs
- Cost Monitoring - Track expenses
- Alerts - Manage notifications
- CI/CD Pipeline - Track deployments
- User Management - Manage users
- AI Ops - AI-powered insights
- Help Center - Get support

### Dashboard Features
- Auto-refreshing metrics (toggle on/off)
- Real-time CPU, RAM, Disk, Network stats
- Active server monitoring
- Recent alerts panel
- System status indicator

### Alert Management
- View active, acknowledged, and resolved alerts
- Filter by status and priority
- Acknowledge or resolve alerts
- View detailed alert information

### Cost Optimization
- Track daily and monthly costs
- View cost by service
- Detect cost anomalies
- Apply AI recommendations for savings

## 🚀 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 🔧 Configuration

### Tailwind CSS
Customize colors, animations, and themes in `tailwind.config.js`

### Vite
Configure build settings in `vite.config.js`

### Routing
Add new routes in `src/routes/AppRoutes.jsx`

## 📝 Notes

- All data shown is **dummy/sample data** for demonstration
- Real backend integration required for production use
- Authentication is simulated with localStorage
- Metrics are randomly generated for demo purposes

## 🎨 Color Scheme

- **Primary:** Cyan (rgb(6, 182, 212))
- **Secondary:** Blue (rgb(37, 99, 235))
- **Background:** Gray-950 (rgb(3, 7, 18))
- **Success:** Green (rgb(34, 197, 94))
- **Warning:** Yellow (rgb(234, 179, 8))
- **Error:** Red (rgb(239, 68, 68))

## 🔒 Security Features

- No public signup
- Organization ID required
- Professional email validation
- Password reset flow
- Access request system
- Account disable functionality
- Activity logging
- Audit trail

## 📞 Support

For support and inquiries:
- Email: support@enterprise.sa
- Submit ticket via Help Center
- Check system status page

## 📄 License

This is an enterprise application for internal use only.

---

**Built with ❤️ for Saudi Government Enterprises**

© 2025 InfraTrack Enterprise. Kingdom of Saudi Arabia.
