const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment.js');
const Maintenance = require('../models/Maintenance.js');
const Team = require('../models/Team.js');
const Inventory = require('../models/Inventory.js');

router.get('/', async (req, res) => {
  try {
    // Fetch equipment data
    const equipment = await Equipment.find();
    const totalEquipment = equipment.length;
    const activeEquipment = equipment.filter(e => e.status === 'Active').length;
    const equipmentInMaintenance = equipment.filter(e => e.status === 'Under Maintenance').length;
    const scrapppedEquipmentCount = equipment.filter(e => e.status === 'Scrapped').length;

    // Calculate critical equipment
    const criticalEquipment = equipment.filter(e => e.condition === 'Poor' || e.condition === 'Fair').length;

    // Fetch maintenance data with populated references
    const allMaintenance = await Maintenance.find()
      .populate('equipment', 'assetName')
      .populate('team', 'teamName')
      .lean();
    
    console.log('All Maintenance Records:', allMaintenance.length);
    
    const pendingMaintenance = allMaintenance.filter(m => m.status === 'New').length;
    const overdueMaintenance = allMaintenance.filter(m => {
      if (m.scheduledDate && new Date(m.scheduledDate) < new Date() && m.status !== 'Repaired') {
        return true;
      }
      return false;
    }).length;

    const completedMaintenance = allMaintenance.filter(m => m.status === 'Repaired').length;

    // Get upcoming maintenance (scheduled for future dates)
    const upcomingMaintenance = allMaintenance
      .filter(m => m.scheduledDate && new Date(m.scheduledDate) >= new Date())
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

    console.log('Upcoming Maintenance:', upcomingMaintenance.length);
    console.log('Sample Upcoming:', upcomingMaintenance.slice(0, 2));

    // Calculate total maintenance cost (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentMaintenance = allMaintenance.filter(m => 
      new Date(m.requestDate) >= thirtyDaysAgo
    );
    
    const totalMaintenanceCost = recentMaintenance.reduce((sum, m) => sum + (m.estimatedCost || 0), 0);

    // Fetch inventory data
    const inventory = await Inventory.find();
    const lowInventoryItems = inventory.map(item => ({
      id: item._id,
      itemName: item.itemName,
      quantity: item.quantity,
      threshold: item.threshold,
      status: item.quantity === 0 ? 'Out of Stock' : item.quantity <= item.threshold ? 'Low Stock' : 'In Stock'
    }));

    // Fetch team data
    const teams = await Team.find();
    const totalTeamMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);

    // Send response
    res.json({
      totalEquipment,
      activeEquipment,
      equipmentInMaintenance,
      scrapppedEquipmentCount,
      criticalEquipment,
      pendingMaintenance,
      overdueMaintenance,
      completedMaintenance,
      totalMaintenanceCost: Math.round(totalMaintenanceCost),
      lowInventoryItems,
      totalTeamMembers,
      equipment,
      upcomingMaintenance: upcomingMaintenance.map(m => ({
        _id: m._id,
        equipment: m.equipment,
        assetName: m.equipment?.assetName || m.assetName,
        workspace: m.workspace,
        type: m.type,
        priority: m.priority,
        status: m.status,
        scheduledDate: m.scheduledDate,
        description: m.description,
        team: m.team
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: error.message });
  }
});

module.exports = router;
