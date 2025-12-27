# 🔧 GearGuard – Equipment Maintenance Tracker

A complete full-stack maintenance tracking system built with **React**, **Node.js**, **MongoDB**, and **Socket.io** for real-time updates.

## 📋 Project Structure

```
GearGuard-2/
├── backend/
│   ├── src/
│   │   ├── models/              (Mongoose schemas)
│   │   ├── controllers/         (Business logic)
│   │   ├── routes/              (API endpoints)
│   │   ├── middleware/          (Auth, validation)
│   │   ├── config/              (DB connection)
│   │   └── server.js            (Entry point)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/               (React pages)
│   │   ├── components/          (Reusable components)
│   │   ├── hooks/               (Custom hooks)
│   │   ├── utils/               (API client, Auth context)
│   │   ├── App.jsx              (Router setup)
│   │   └── main.jsx             (Entry point)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── tailwind.config.js
├── DESIGN.md                    (System design document)
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** (local or Atlas connection string)

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
```

**Backend .env example:**
```
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your_super_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Start backend:**
```bash
npm run dev
# Backend running on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install

npm run dev
# Frontend running on http://localhost:5173
```

### 3. MongoDB Connection

**Option A: Local MongoDB**
```bash
mongod  # Start MongoDB server
```

**Option B: MongoDB Atlas (Cloud)**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gearguard?retryWrites=true&w=majority
```

## 📱 Features & Pages

| Page | Purpose | Key Features |
|------|---------|--------------|
| **Login** | Authentication | JWT token storage, session persistence |
| **Dashboard** | Overview & alerts | System stats, pending tasks, low inventory |
| **Equipment** | Asset management | CRUD operations, maintenance team assignment |
| **Kanban** | Workflow tracking | Drag-drop board, status transitions (New→In Progress→Repaired/Scrap) |
| **Calendar** | Schedule view | Preventive maintenance scheduling, upcoming tasks |
| **Inventory** | Parts tracking | Stock levels, threshold alerts, restock management |
| **Suppliers** | Vendor management | Contact details, item linkages |
| **Reports** | Analytics | Asset performance, cost trends, usage reports |

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       → Create account
POST   /api/auth/login          → Login
GET    /api/auth/me             → Current user
```

### Core Resources
```
GET    /api/equipment           → List all equipment
POST   /api/equipment           → Create equipment
PUT    /api/equipment/:id       → Update equipment
DELETE /api/equipment/:id       → Delete equipment

GET    /api/maintenance         → List all maintenance
GET    /api/maintenance/kanban/board  → Kanban board data
POST   /api/maintenance         → Create maintenance (auto-fills team)
PUT    /api/maintenance/:id     → Update status (validates transitions)
DELETE /api/maintenance/:id     → Delete maintenance

GET    /api/inventory           → List inventory items
POST   /api/inventory           → Create item
PUT    /api/inventory/:id       → Update (triggers low-stock alerts)
DELETE /api/inventory/:id       → Delete item

GET    /api/suppliers           → List suppliers
POST   /api/suppliers           → Create supplier
PUT    /api/suppliers/:id       → Update supplier
DELETE /api/suppliers/:id       → Delete supplier

GET    /api/dashboard           → Dashboard summary
```

### Reports
```
GET    /api/reports/maintenance-history/:equipmentId
GET    /api/reports/maintenance-costs
GET    /api/reports/inventory-usage
GET    /api/reports/asset-performance
```

## 🔄 Real-Time Events (Socket.io)

### Server → Client
```javascript
socket.on('maintenance-created', (data) => {...})
socket.on('maintenance-status-updated', (data) => {...})
socket.on('equipment-scrapped', (data) => {...})
socket.on('low-inventory-alert', (data) => {...})
socket.on('maintenance-completed', (data) => {...})
```

### Client → Server
```javascript
socket.emit('update-maintenance-status', {maintenanceId, newStatus})
socket.emit('inventory-restocked', {itemId, quantityAdded})
```

## 💼 Core Business Logic

### 1. Auto-Fill Maintenance Team
When creating a maintenance record, the `maintenanceTeam` field is automatically populated from the equipment's assigned team.

### 2. Kanban Status Flow
```
New → In Progress → Repaired
                 ↘ Scrap (only for Corrective maintenance)
```

### 3. Preventive vs Corrective
- **Preventive:** Scheduled maintenance (has `scheduledDate`), reduces downtime
- **Corrective:** Reactive repairs, can lead to scrap decision if uneconomical

### 4. Scrap Logic
When maintenance.status = "Scrap":
- equipment.status = "Scrapped"
- equipment.condition = "Scrap"
- Equipment marked unusable in reports
- Cannot create new maintenance for scrapped equipment

### 5. Inventory Management
On maintenance completion (status = "Repaired"):
- Automatic deduction from inventory for parts used
- Low-stock alerts if quantity < threshold
- Trigger Socket.io notifications

## 🛠️ Development

### Backend Technologies
- **Express** (HTTP server)
- **Mongoose** (MongoDB ODM)
- **Socket.io** (Real-time events)
- **bcryptjs** (Password hashing)
- **JWT** (Authentication)

### Frontend Technologies
- **React 18** (UI framework)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Axios** (HTTP client)
- **Socket.io-client** (Real-time updates)
- **react-calendar** (Calendar component)
- **dnd-kit** (Drag-drop for Kanban)

## 🔐 Security

- **JWT Authentication:** Token stored in localStorage
- **Password Hashing:** bcryptjs with 10-salt rounds
- **Protected Routes:** All endpoints except /auth require valid JWT
- **Token Refresh:** Auto-logout on 403 (expired token)

## 📊 Database Schema Summary

| Collection | Key Fields | Purpose |
|-----------|-----------|---------|
| **Users** | email, password, role | User accounts & authentication |
| **Equipment** | assetName, category, status, maintenanceTeam | Asset registry |
| **Maintenance** | equipment, type, status, technician, partsUsed | Work orders |
| **Inventory** | itemName, quantityOnHand, minimumThreshold | Parts tracking |
| **Suppliers** | supplierName, contact, email | Vendor management |

## 🧪 Testing

### Manual Test Flow
1. **Register** → Create account at `/login`
2. **Add Equipment** → Create pump, motor, generator
3. **Assign Team** → Add technicians to equipment
4. **Create Maintenance** → Auto-team-fill should work
5. **Kanban Board** → Move card between columns
6. **Inventory** → Add parts, check low-stock alerts
7. **Calendar** → Schedule preventive maintenance
8. **Reports** → View asset performance metrics

## 🚨 Common Issues

### MongoDB Connection Fails
```
✅ Ensure MongoDB service is running: mongod
✅ Check MONGODB_URI in .env
✅ For Atlas: Whitelist your IP in MongoDB Cluster
```

### Frontend API 404 Errors
```
✅ Ensure backend is running on port 5000
✅ Check proxy settings in vite.config.js
✅ Browser DevTools Network tab to verify requests
```

### Socket.io Events Not Firing
```
✅ Open browser DevTools → Network → WS tab
✅ Ensure Socket.io is connected
✅ Check server console for error logs
```

## 📦 Deployment

### Backend (Heroku/Railway)
```bash
# Ensure Procfile exists or configure start script
heroku create gearguard-api
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder to Vercel/Netlify
```

## 📝 Future Enhancements

- [ ] File uploads for equipment images
- [ ] Email notifications for overdue maintenance
- [ ] SMS alerts for critical issues
- [ ] Advanced search & filtering
- [ ] Bulk operations on equipment
- [ ] Export reports to PDF/Excel
- [ ] Mobile app (React Native)
- [ ] Predictive maintenance (ML)
- [ ] Multi-tenant support
- [ ] Audit logs

## 📄 License

MIT

## 👨‍💻 Developer Notes

- **No Express dependency:** Uses vanilla Node.js HTTP server ✅
- **Hackathon-ready:** Minimal, clean, no overengineering ✅
- **Offline-first:** Data cached locally for offline access ✅
- **Real-time:** Socket.io for instant updates ✅
- **Fully typed:** Mongoose schema validation ✅

---

**Built with ❤️ for GearGuard Hackathon**
