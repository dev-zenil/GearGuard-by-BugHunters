import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  workspace: {
    type: String
  },
  maintenanceCategory: {
    type: String,
    enum: ['Equipment', 'Workspace'],
    required: true
  },
  type: {
    type: String,
    enum: ['Preventive', 'Corrective'],
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Repaired', 'Scrap'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    default: 'Moderate'
  },
  requestDate: Date,
  scheduledDate: Date,
  completionDate: Date,
  description: String,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  company: {
    type: String
  },
  maintenanceTeam: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  cost: Number,
  partsUsed: [
    {
      partId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory'
      },
      quantityUsed: Number
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Maintenance', maintenanceSchema);
