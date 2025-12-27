import Maintenance from '../models/Maintenance.js';
import Equipment from '../models/Equipment.js';
import Inventory from '../models/Inventory.js';

// Maintenance history by equipment
export const getMaintenanceHistory = async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const maintenance = await Maintenance.find({ equipment: equipmentId })
      .populate('technician', 'fullName email')
      .sort({ date: -1 });

    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Maintenance costs report
export const getMaintenanceCosts = async (req, res) => {
  try {
    const costs = await Maintenance.aggregate([
      { $match: { cost: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            month: { $month: '$completionDate' },
            year: { $year: '$completionDate' }
          },
          totalCost: { $sum: '$cost' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json(costs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Inventory usage report
export const getInventoryUsage = async (req, res) => {
  try {
    let inventory = await Inventory.find().populate('supplier', 'supplierName');

    // Fix items missing status field
    const itemsToUpdate = inventory.filter(item => !item.status);
    if (itemsToUpdate.length > 0) {
      for (let item of itemsToUpdate) {
        let newStatus = 'In Stock';
        if (item.quantityOnHand === 0) {
          newStatus = 'Out of Stock';
        } else if (item.quantityOnHand < item.minimumThreshold) {
          newStatus = 'Low Stock';
        }
        await Inventory.findByIdAndUpdate(item._id, { status: newStatus });
      }
      // Re-fetch after updates
      inventory = await Inventory.find().populate('supplier', 'supplierName');
    }

    const usage = inventory.map(item => ({
      _id: item._id,
      itemName: item.itemName,
      quantityOnHand: item.quantityOnHand,
      minimumThreshold: item.minimumThreshold,
      status: item.status,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier?.supplierName,
      restockFrequency: item.lastRestockDate ? 'Recent' : 'Never'
    }));

    res.json(usage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Asset performance report
export const getAssetPerformance = async (req, res) => {
  try {
    const equipment = await Equipment.find().select('assetName condition status');

    const performance = await Promise.all(
      equipment.map(async (eq) => {
        const totalMaintenance = await Maintenance.countDocuments({ equipment: eq._id });
        const preventiveMaintenance = await Maintenance.countDocuments({
          equipment: eq._id,
          type: 'Preventive'
        });
        const correctiveMaintenance = await Maintenance.countDocuments({
          equipment: eq._id,
          type: 'Corrective'
        });

        return {
          _id: eq._id,
          assetName: eq.assetName,
          condition: eq.condition,
          status: eq.status,
          totalMaintenance,
          preventiveMaintenance,
          correctiveMaintenance,
          reliabilityScore: totalMaintenance > 0 ? (preventiveMaintenance / totalMaintenance * 100).toFixed(2) : 0
        };
      })
    );

    res.json(performance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
