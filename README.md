# ⚙️ GearGuard - Equipment Maintenance Management System

A comprehensive web-based equipment maintenance and inventory tracking system designed for IT companies and enterprise organizations. GearGuard provides real-time monitoring, scheduling, and management of equipment maintenance, inventory, and team operations.

---

## 🎯 Project Overview

GearGuard is a full-stack MERN (MongoDB, Express, React, Node.js) application that helps organizations:
- Track and manage IT equipment and assets
- Schedule and monitor maintenance activities
- Manage inventory and spare parts
- Organize teams and assign maintenance tasks
- Monitor supplier relationships
- Generate maintenance reports and analytics
- Real-time notifications via WebSocket

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: December 27, 2025

---

## ✨ Key Features

### 📊 Dashboard
- **Real-time Analytics**: Equipment status, maintenance metrics, inventory levels
- **Performance Cards**: Critical equipment count, technician load, open requests, maintenance costs
- **Maintenance Calendar**: Interactive calendar showing scheduled maintenance with filtering
- **Activities Overview**: Recent and pending maintenance activities with status tracking
- **Real-time Updates**: WebSocket integration for instant data synchronization

### 🖥️ Equipment Management
- **Asset Tracking**: Complete equipment inventory with serial numbers, manufacturer details
- **Condition Monitoring**: Track equipment condition (Excellent, Good, Fair, Poor, Scrap)
- **Status Management**: Active, Inactive, Under Maintenance, Scrapped status tracking
- **Team Assignment**: Assign maintenance teams to equipment
- **Supplier Linking**: Connect equipment to suppliers
- **Notes & Documentation**: Detailed notes for each equipment item

### 🔧 Maintenance Management
- **Preventive Maintenance**: Schedule routine maintenance tasks
- **Corrective Maintenance**: Track emergency repairs and issue resolution
- **Dual Category Support**: Equipment and Workspace maintenance tracking
- **Priority Levels**: Low, Moderate, High priority management
- **Status Workflow**: New → In Progress → Repaired/Scrap status flow
- **Cost Tracking**: Record maintenance costs and generate expense reports

### 📦 Inventory Management
- **Stock Tracking**: Monitor inventory levels in real-time
- **Threshold Alerts**: Automatic low stock and out-of-stock notifications
- **Categories**: Parts, Consumables, Tools classification
- **Supplier Integration**: Link inventory to suppliers
- **Equipment Linking**: Connect inventory to relevant equipment
- **Cost Management**: Track unit costs and calculate total inventory value

### 👥 Team Management
- **Team Organization**: Group technicians into specialized teams
- **Member Assignment**: Assign team members to maintenance tasks
- **Workload Tracking**: Monitor team availability and assignments
- **Role-Based Access**: Admin, Technician, Viewer roles

### 🏢 Supplier Management
- **Vendor Directory**: Maintain supplier contact information
- **Items Supplied**: Track which items each supplier provides
- **Contact Management**: Email and phone contact details
- **Address Management**: Complete supplier location information

### 📈 Reports & Analytics
- **Maintenance Reports**: Detailed maintenance history and trends
- **Cost Analysis**: Maintenance costs over time periods
- **Equipment Status**: Equipment condition and status summaries
- **Inventory Reports**: Stock levels and consumption patterns
- **Team Performance**: Technician workload and productivity metrics

### 📅 Calendar View
- **Monthly Calendar**: Interactive maintenance scheduling
- **Event Indicators**: Visual markers for scheduled maintenance
- **Date Selection**: Click dates to view scheduled maintenance
- **Quick Add**: Schedule new maintenance directly from calendar

### 🎯 Kanban Board
- **Visual Workflow**: Drag-and-drop maintenance task management
- **Status Columns**: New, In Progress, Completed, Cancelled
- **Quick Overview**: See all tasks at a glance
- **Task Details**: Click tasks to view and edit details

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18.2 with Vite (modern bundler)
- React Router for client-side navigation
- Tailwind CSS for responsive styling
- Chart.js for analytics and visualizations
- React Calendar for scheduling UI
- Socket.io Client for real-time updates
- Axios for HTTP API calls
- dnd-kit for drag-and-drop functionality

**Backend:**
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT (JSON Web Tokens) for authentication
- Socket.io for WebSocket communication
- bcryptjs for password hashing
- CORS middleware for cross-origin requests

**Database:**
- MongoDB (NoSQL document database)
- 6 primary collections: Users, Equipment, Maintenance, Teams, Suppliers, Inventory

---

## 📁 Project Structure

```
GearGuard-2/
├── backend/
│   ├── src/
│   │   ├── models/              # Database schemas
│   │   │   ├── User.js          # User accounts & authentication
│   │   │   ├── Equipment.js     # Asset registry
│   │   │   ├── Maintenance.js   # Work orders
│   │   │   ├── Team.js          # Team grouping
│   │   │   ├── Supplier.js      # Vendor management
│   │   │   └── Inventory.js     # Parts & consumables
│   │   ├── controllers/         # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── equipment.controller.js
│   │   │   ├── maintenance.controller.js
│   │   │   ├── inventory.controller.js
│   │   │   ├── supplier.controller.js
│   │   │   ├── team.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── report.controller.js
│   │   ├── routes/              # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── equipment.routes.js
│   │   │   ├── maintenance.routes.js
│   │   │   ├── inventory.routes.js
│   │   │   ├── supplier.routes.js
│   │   │   ├── team.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── report.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js    # JWT verification
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   └── server.js                # Express server setup
│   ├── seeds/                   # Database seeding scripts
│   │   ├── itCompanySeed.js    # IT company sample data
│   │   ├── completeSeed.js
│   │   └── cleanDatabase.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/               # React pages
│   │   │   ├── Login.jsx        # Authentication
│   │   │   ├── Dashboard.jsx    # Main overview
│   │   │   ├── Equipment.jsx    # Asset management
│   │   │   ├── Maintenance.jsx  # Work orders
│   │   │   ├── Calendar.jsx     # Schedule view
│   │   │   ├── Inventory.jsx    # Parts tracking
│   │   │   ├── Activity.jsx     # Activity feed
│   │   │   ├── Suppliers.jsx    # Vendor management
│   │   │   ├── Teams.jsx        # Team organization
│   │   │   ├── Reports.jsx      # Analytics
│   │   │   └── KanbanBoard.jsx  # Visual workflow
│   │   ├── components/          # Reusable components
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   └── ProtectedRoute.jsx # Auth guard
│   │   ├── utils/               # Helper utilities
│   │   │   ├── api.js          # Axios instance
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useApi.js        # API request hook
│   │   │   └── useSocket.js     # WebSocket hook
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Global styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **MongoDB**: Local or Atlas cloud instance
- **Git**: For version control

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** in backend root:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gearguard
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string
   # MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gearguard
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** in frontend root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   App will start on `http://localhost:5173`

### Database Seeding

Populate the database with realistic IT company data:

```bash
cd backend
npm run seed
```

This creates:
- **11 users** (2 admins, 7 technicians, 2 viewers)
- **4 teams** (Infrastructure, Network, Security, Support)
- **6 suppliers** (Dell, Cisco, HPE, Fortinet, Palo Alto, TechSupply)
- **11 equipment items** (servers, switches, security appliances, storage, UPS, backup systems)
- **10 inventory items** (CPUs, RAM, SSDs, transceivers, cables, licenses, tapes, PDU cables, tools)
- **13 maintenance activities** (preventive & corrective maintenance, workspace maintenance)

### Reset Database

To completely reset and reseed:

```bash
cd backend
npm run reset
```

This runs: `npm run clean && npm run seed`

---

## 🔐 Authentication & Security

### Authentication Flow
1. **Registration**: Users sign up with email, password, and full name
2. **Validation**: Password must meet security requirements
3. **JWT Token**: Issued upon successful login
4. **Token Storage**: Stored in browser localStorage
5. **Protected Routes**: Frontend routes require valid token
6. **API Protection**: Backend endpoints verify token via middleware
7. **Auto-Logout**: Expired tokens (7 days) trigger logout

### Password Requirements
- Minimum **8 characters**
- At least **1 uppercase letter**
- At least **1 lowercase letter**
- At least **1 special character** (!@#$%^&*(),.?":{}|<>)

### Role-Based Access Control (RBAC)
- **Admin**: Full system access, user management, all features
- **Technician**: Create/update maintenance, view equipment, manage teams
- **Viewer**: Read-only access to dashboards, reports, and data (new signups default to Viewer)

### Security Features
- **JWT Authentication**: Secure token-based sessions
- **Password Hashing**: bcryptjs with 10 salt rounds
- **CORS Protection**: Cross-origin requests validated
- **Protected Endpoints**: All routes except /auth require valid JWT
- **Secure Comparison**: bcryptjs password comparison prevents timing attacks
- **Token Expiration**: 7-day expiration for security

---

## 📡 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get current user | Yes |

### Equipment Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Get all equipment |
| GET | `/api/equipment/:id` | Get single equipment |
| POST | `/api/equipment` | Create new equipment |
| PUT | `/api/equipment/:id` | Update equipment |
| DELETE | `/api/equipment/:id` | Delete equipment |

### Maintenance Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/maintenance` | Get all maintenance records |
| GET | `/api/maintenance/:id` | Get single maintenance |
| POST | `/api/maintenance` | Create maintenance |
| PUT | `/api/maintenance/:id` | Update maintenance |
| DELETE | `/api/maintenance/:id` | Delete maintenance |

### Inventory Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get all inventory items |
| GET | `/api/inventory/:id` | Get single inventory item |
| POST | `/api/inventory` | Create inventory item |
| PUT | `/api/inventory/:id` | Update inventory |
| DELETE | `/api/inventory/:id` | Delete inventory |

### Team Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get all teams |
| GET | `/api/teams/:id` | Get single team |
| POST | `/api/teams` | Create team |
| PUT | `/api/teams/:id` | Update team |
| DELETE | `/api/teams/:id` | Delete team |

### Supplier Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suppliers` | Get all suppliers |
| GET | `/api/suppliers/:id` | Get single supplier |
| POST | `/api/suppliers` | Create supplier |
| PUT | `/api/suppliers/:id` | Update supplier |
| DELETE | `/api/suppliers/:id` | Delete supplier |

### Dashboard Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get dashboard summary (stats, cards, alerts) |

### Report Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/maintenance` | Maintenance history & trends |
| GET | `/api/reports/inventory` | Inventory usage report |
| GET | `/api/reports/costs` | Cost analysis report |

---

## 💾 Database Models

### User Model
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: String, // "admin" | "technician" | "viewer"
  createdAt: Date,
  updatedAt: Date
}
```

### Equipment Model
```javascript
{
  _id: ObjectId,
  assetName: String,
  category: String, // "Server", "Network Switch", "Security Appliance", etc.
  manufacturer: String,
  model: String,
  serialNumber: String,
  purchaseDate: Date,
  condition: String, // "Excellent" | "Good" | "Fair" | "Poor" | "Scrap"
  status: String, // "Active" | "Inactive" | "Under Maintenance" | "Scrapped"
  maintenanceTeam: [ObjectId → User],
  suppliers: [ObjectId → Supplier],
  notes: String,
  createdBy: ObjectId → User,
  createdAt: Date,
  updatedAt: Date
}
```

### Maintenance Model
```javascript
{
  _id: ObjectId,
  equipment: ObjectId → Equipment,
  workspace: String, // For workspace maintenance
  maintenanceCategory: String, // "Equipment" | "Workspace"
  type: String, // "Preventive" | "Corrective"
  priority: String, // "Low" | "Moderate" | "High"
  status: String, // "New" | "In Progress" | "Repaired" | "Scrap"
  requestDate: Date,
  scheduledDate: Date,
  completionDate: Date,
  description: String,
  notes: String,
  cost: Number,
  team: ObjectId → Team,
  technician: ObjectId → User,
  createdBy: ObjectId → User,
  company: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Model
```javascript
{
  _id: ObjectId,
  itemName: String,
  category: String, // "Parts" | "Consumables" | "Tools"
  quantityOnHand: Number,
  minimumThreshold: Number,
  status: String, // "In Stock" | "Low Stock" | "Out of Stock"
  costPerUnit: Number,
  supplier: ObjectId → Supplier,
  linkedEquipment: [ObjectId → Equipment],
  lastRestockDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Team Model
```javascript
{
  _id: ObjectId,
  teamName: String,
  company: String,
  teamMembers: [ObjectId → User],
  createdAt: Date,
  updatedAt: Date
}
```

### Supplier Model
```javascript
{
  _id: ObjectId,
  supplierName: String,
  contactPerson: String,
  email: String,
  phone: String,
  address: String,
  itemsSupplied: [ObjectId → Inventory],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Test Credentials

### Admin Account (Full Access)
```
Email: rajesh.kumar@techcorp.com
Password: TechCorp@2024
Role: Admin
```

### Viewer Account (Read-Only)
```
Email: suresh.mishra@techcorp.com
Password: TechCorp@2024
Role: Viewer
```

### Other Test Accounts
- **Technicians**: amit.patel@techcorp.com, neha.singh@techcorp.com, vikram.reddy@techcorp.com, etc.
- **All use same password**: TechCorp@2024

---

## 🎨 UI/UX Features

### Dashboard
- Real-time status cards with key metrics
- Interactive maintenance calendar
- Activities feed with status indicators
- Responsive grid layout
- Color-coded priorities and statuses

### Responsive Design
- Mobile-friendly Tailwind CSS styling
- Collapsible navigation menu
- Responsive data tables and cards
- Touch-optimized button sizes
- Adaptive grid layouts

### Visual Feedback
- Loading indicators for async operations
- Success/error notifications
- Color-coded status badges
- Icons for quick identification
- Hover effects on interactive elements

---

## 📊 Features in Detail

### Dashboard Analytics
- **Equipment Status Cards**: Quick view of active/inactive/maintenance/scrapped equipment counts
- **Critical Equipment Alert**: Count of equipment in Fair or Poor condition
- **Technician Load Percentage**: Workload distribution visualization
- **Open Requests**: Pending and overdue maintenance count
- **Maintenance Costs**: Monthly and historical cost tracking
- **Inventory Status**: Real-time low stock and out-of-stock alerts
- **Upcoming Maintenance**: Preview of scheduled tasks
- **Activities Feed**: Recent maintenance activities with timestamps

### Real-Time Updates (WebSocket)
- Equipment status changes propagate instantly
- Maintenance status updates notify team members
- Low inventory alerts trigger immediately
- Team member activity tracking
- Multi-user simultaneous access support

### Responsive Design Features
- Mobile-friendly Tailwind CSS components
- Collapsible navigation sidebar
- Responsive data tables with horizontal scroll on mobile
- Touch-optimized form inputs
- Adaptive dashboard grid layouts
- Dark-mode ready CSS classes

---

## 🔄 Workflow Examples

### Creating Maintenance Schedule
1. Navigate to Equipment or Calendar page
2. Click "Schedule Maintenance" or select date on calendar
3. Select equipment/workspace
4. Choose maintenance type (Preventive/Corrective)
5. Set priority level (Low/Moderate/High)
6. Set scheduled date
7. Assign team or technician
8. Add description and estimated cost
9. Submit form
10. Dashboard updates automatically with Socket.io

### Managing Inventory
1. Navigate to Equipment → Inventory tab
2. View all inventory items with real-time stock levels
3. Items with low stock highlighted automatically
4. Click item to edit quantity or supplier
5. Update supplier contact information
6. Reorder triggers automatic notifications
7. Track consumption history and costs

### Team Management
1. Go to Teams page
2. Create new team with name and company
3. Add team members from user list
4. Assign teams to equipment and maintenance
5. Monitor team workload from dashboard
6. Generate team performance reports
7. Track technician availability and assignments

---

## 📈 Reports & Analytics

### Available Reports
1. **Maintenance Report**: Historical maintenance records with status, duration, costs, equipment details
2. **Inventory Report**: Stock levels, consumption patterns, supplier distribution
3. **Cost Analysis**: Maintenance expenses by equipment, team, time period
4. **Equipment Status**: Condition distribution, age analysis, utilization rates
5. **Team Performance**: Task completion rates, average resolution time, workload

### Chart Types
- Bar charts for comparisons
- Pie charts for distributions
- Line charts for trends
- Tabular data exports
- Date range filtering
- Export to CSV/PDF

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error**: `MongooseConnectionError` or "Cannot connect to MongoDB"
**Solution**:
- Ensure MongoDB service is running: `mongod`
- Check MONGODB_URI in .env file
- Verify database credentials
- For MongoDB Atlas: Whitelist your IP in cluster settings

### CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`
**Solution**:
- Verify FRONTEND_URL in backend .env
- Check VITE_API_URL in frontend .env
- Clear browser cache and localStorage
- Restart both servers

### JWT Token Error
**Error**: `401 Unauthorized` or "Invalid token"
**Solution**:
- Clear localStorage: `localStorage.clear()`
- Log out and log back in
- Verify JWT_SECRET in backend .env
- Check token expiration (7 days)

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`
**Solution**:
- Change PORT in backend .env (e.g., 5001)
- Update API URL in frontend .env
- Kill process on port: `lsof -i :5000` then `kill -9 <PID>`

### WebSocket Connection Failed
**Error**: Socket.io events not firing
**Solution**:
- Check browser DevTools Network → WS tab
- Verify Socket.io connection status
- Check server console for error logs
- Ensure backend is running

---

## 📝 NPM Scripts

### Backend Scripts
```bash
npm start          # Production server
npm run dev        # Development with auto-reload (node --watch)
npm run seed       # Load IT company sample data
npm run clean      # Reset/clear database
npm run reset      # Clean + seed (full reset)
npm test           # Run tests (if configured)
```

### Frontend Scripts
```bash
npm run dev        # Development server on http://localhost:5173
npm run build      # Build for production to dist/
npm run preview    # Preview production build
```

---

## 📦 Dependencies

### Backend Dependencies
- **express** (^4.18.2): Web server framework
- **mongoose** (^8.0.0): MongoDB object modeling
- **jsonwebtoken** (^9.0.2): JWT authentication
- **bcryptjs** (^2.4.3): Password hashing
- **cors** (^2.8.5): Cross-origin request handling
- **socket.io** (^4.5.4): Real-time WebSocket communication
- **dotenv** (^16.3.1): Environment variable management

### Frontend Dependencies
- **react** (^18.2.0): UI library
- **react-router-dom** (^6.20.0): Client-side routing
- **axios** (^1.6.0): HTTP client
- **tailwindcss** (^3.3.6): Utility CSS styling
- **chart.js** (^4.4.0): Chart library
- **react-chartjs-2** (^5.2.0): React wrapper for Chart.js
- **react-calendar** (^4.8.0): Calendar component
- **socket.io-client** (^4.5.4): WebSocket client
- **@dnd-kit/core** (^6.0.8): Drag-and-drop foundation
- **vite** (^7.3.0): Modern build tool

---

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Render, AWS)

1. **Prepare for production**:
   ```bash
   # Update .env with production values
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gearguard
   JWT_SECRET=production_secret_key_here
   NODE_ENV=production
   ```

2. **Deploy to Heroku**:
   ```bash
   heroku login
   heroku create gearguard-api
   git push heroku main
   heroku logs --tail
   ```

3. **Or deploy to Railway/Render**: Connect GitHub repo and auto-deploy

### Frontend Deployment (Vercel, Netlify, AWS S3)

1. **Build for production**:
   ```bash
   npm run build
   # Creates optimized dist/ folder
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   # Follow interactive prompts
   ```

3. **Or deploy to Netlify**: 
   - Connect GitHub repo
   - Set build command: `npm run build`
   - Set publish directory: `dist`

4. **Update API URL**:
   - Set VITE_API_URL to production backend URL
   - Rebuild after changing environment

---

## 🔧 Configuration Files

### Backend .env Example
```env
# Database
MONGODB_URI=mongodb://localhost:27017/gearguard
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/gearguard?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend .env Example
```env
VITE_API_URL=http://localhost:5000/api
```

### Vite Config
- Proxy setup for development
- Build optimization
- HMR configuration for hot reload

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT.io](https://jwt.io)
- [Mongoose Docs](https://mongoosejs.com)
- [Vite Documentation](https://vitejs.dev)

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👥 Contributing

### How to Contribute
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m 'Add feature description'`
5. Push: `git push origin feature/your-feature`
6. Submit pull request with description

### Code Standards
- Use consistent indentation (2 spaces)
- Follow ES6+ JavaScript standards
- Use meaningful variable names
- Add comments for complex logic
- Test changes before submitting

---

## 📞 Support & Contact

For issues, questions, or suggestions:
1. Check this README and troubleshooting section
2. Review error logs in browser console and server terminal
3. Check GitHub issues for similar problems
4. Contact development team

---

## 🎯 Future Enhancements

- [ ] File uploads for equipment photos
- [ ] Email notifications for overdue maintenance
- [ ] SMS alerts for critical issues
- [ ] Advanced search and filtering
- [ ] Bulk operations on equipment
- [ ] Export reports to PDF/Excel
- [ ] Mobile app (React Native)
- [ ] Predictive maintenance (ML)
- [ ] Multi-tenant support
- [ ] Audit logs and history
- [ ] Equipment depreciation tracking
- [ ] Preventive maintenance scheduling automation

---

## 📊 System Requirements

### Minimum
- **CPU**: 2 cores
- **RAM**: 2 GB
- **Storage**: 5 GB
- **Network**: 1 Mbps

### Recommended
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 20 GB
- **Network**: 10 Mbps

---

**Built with ❤️ as a Production-Ready Equipment Maintenance System**

**Last Updated**: December 27, 2025 | **Version**: 1.0.0 | **Status**: ✅ Production Ready
