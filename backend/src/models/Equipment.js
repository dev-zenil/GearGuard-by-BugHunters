import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  assetName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  manufacturer: String,
  model: String,
  serialNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  purchaseDate: Date,
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Scrap'],
    default: 'Good'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Under Maintenance', 'Scrapped'],
    default: 'Active'
  },
  maintenanceTeam: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  suppliers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    }
  ],
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

export default mongoose.model('Equipment', equipmentSchema);
