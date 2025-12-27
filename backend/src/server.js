import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import equipmentRoutes from './routes/equipment.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import reportRoutes from './routes/report.routes.js';
import teamRoutes from './routes/team.routes.js';
import authenticateToken from './middleware/auth.middleware.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require JWT token)
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/equipment', authenticateToken, equipmentRoutes);
app.use('/api/maintenance', authenticateToken, maintenanceRoutes);
app.use('/api/inventory', authenticateToken, inventoryRoutes);
app.use('/api/suppliers', authenticateToken, supplierRoutes);
app.use('/api/teams', authenticateToken, teamRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Maintenance status update
  socket.on('update-maintenance-status', async (data) => {
    try {
      // Broadcast to all clients
      io.emit('maintenance-status-updated', data);
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  // Inventory restock
  socket.on('inventory-restocked', (data) => {
    io.emit('inventory-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Attach io to app for use in routes
app.io = io;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 GearGuard Backend running on port ${PORT}`);
});
