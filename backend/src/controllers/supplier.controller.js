import Supplier from '../models/Supplier.js';

// Get all suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('itemsSupplied', 'itemName');
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single supplier
export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('itemsSupplied');
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create supplier
export const createSupplier = async (req, res) => {
  try {
    const { supplierName, contactPerson, email, phone, address } = req.body;

    if (!supplierName) {
      return res.status(400).json({ error: 'supplierName is required' });
    }

    const supplier = new Supplier({
      supplierName,
      contactPerson,
      email,
      phone,
      address
    });

    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update supplier
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('itemsSupplied');

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete supplier
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
