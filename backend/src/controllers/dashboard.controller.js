import Equipment from '../models/Equipment.js';
import Maintenance from '../models/Maintenance.js';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';

// Get dashboard summary
export const getDashboard = async (req, res) => {
  try {
    const totalEquipment = await Equipment.countDocuments();
    const activeEquipment = await Equipment.countDocuments({ status: 'Active' });
    const equipmentInMaintenance = await Equipment.countDocuments({ status: 'Under Maintenance' });
    const scrapppedEquipmentCount = await Equipment.countDocuments({ status: 'Scrapped' });

    // Get all equipment with condition for critical count
    const equipment = await Equipment.find({}, 'condition status assetName');

    // Count technicians
    const totalTeamMembers = await User.countDocuments({ role: 'technician' });

    const pendingMaintenance = await Maintenance.countDocuments({ status: 'New' });
    const inProgressMaintenance = await Maintenance.countDocuments({ status: 'In Progress' });
    const completedMaintenance = await Maintenance.countDocuments({ status: 'Repaired' });
    const overdueMaintenance = await Maintenance.countDocuments({
      status: 'New',
      scheduledDate: { $lt: new Date() }
    });

    const lowInventoryItems = await Inventory.find({
      $expr: { $lt: ['$quantityOnHand', '$minimumThreshold'] }
    });

    // Fix items missing status field and ensure all items have status
    const allInventory = await Inventory.find();
    const itemsToUpdate = allInventory.filter(item => !item.status);
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
    }

    const upcomingMaintenance = await Maintenance.find({
      status: 'New',
      scheduledDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      }
    }).populate('equipment', 'assetName');

    const maintenanceCosts = await Maintenance.aggregate([
      {
        $match: {
          cost: { $exists: true, $ne: null },
          completionDate: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$cost' }
        }
      }
    ]);

    res.json({
      totalEquipment,
      activeEquipment,
      equipmentInMaintenance,
      scrapppedEquipmentCount,
      equipment,
      totalTeamMembers,
      pendingMaintenance,
      inProgressMaintenance,
      completedMaintenance,
      overdueMaintenance,
      lowInventoryItems: lowInventoryItems.map(item => ({
        id: item._id,
        itemName: item.itemName,
        quantity: item.quantityOnHand,
        threshold: item.minimumThreshold,
        status: item.status
      })),
      upcomingMaintenance,
      totalMaintenanceCost: maintenanceCosts[0]?.totalCost || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
