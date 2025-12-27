import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Parts', 'Consumables', 'Tools']
  },
  quantityOnHand: {
    type: Number,
    required: true,
    default: 0
  },
  minimumThreshold: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  costPerUnit: Number,
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  linkedEquipment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    }
  ],
  lastRestockDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Inventory', inventorySchema);
