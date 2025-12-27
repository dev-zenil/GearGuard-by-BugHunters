import Equipment from '../models/Equipment.js';

// Get all equipment
export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate('maintenanceTeam', 'fullName email')
      .populate('suppliers', 'supplierName')
      .populate('createdBy', 'fullName');
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single equipment
export const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('maintenanceTeam', 'fullName email')
      .populate('suppliers')
      .populate('createdBy', 'fullName');
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create equipment
export const createEquipment = async (req, res) => {
  try {
    const { assetName, category, manufacturer, model, serialNumber, purchaseDate, maintenanceTeam } = req.body;

    if (!assetName || !category) {
      return res.status(400).json({ error: 'assetName and category are required' });
    }

    const equipment = new Equipment({
      assetName,
      category,
      manufacturer,
      model,
      serialNumber,
      purchaseDate,
      maintenanceTeam: maintenanceTeam || [],
      createdBy: req.userId
    });

    await equipment.save();
    await equipment.populate('maintenanceTeam', 'fullName email');

    res.status(201).json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update equipment
export const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('maintenanceTeam', 'fullName email');

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete equipment
export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
