import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
    unique: true
  },
  contactPerson: String,
  email: String,
  phone: String,
  address: String,
  itemsSupplied: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Supplier', supplierSchema);
