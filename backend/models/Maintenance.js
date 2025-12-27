const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      default: null
    },
    assetName: String,
    workspace: String,
    type: {
      type: String,
      enum: ['Preventive', 'Corrective'],
      required: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      default: 'Moderate'
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Repaired', 'Scrap'],
      default: 'New'
    },
    maintenanceCategory: {
      type: String,
      enum: ['Equipment', 'Workspace'],
      default: 'Equipment'
    },
    requestDate: {
      type: Date,
      default: Date.now
    },
    scheduledDate: Date,
    description: String,
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    company: String,
    notes: String,
    estimatedCost: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
