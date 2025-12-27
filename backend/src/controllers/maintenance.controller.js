import Maintenance from '../models/Maintenance.js';
import Equipment from '../models/Equipment.js';
import Inventory from '../models/Inventory.js';

// Get all maintenance records
export const getAllMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate('equipment', 'assetName')
      .populate('technician', 'fullName email')
      .populate('team', 'teamName')
      .populate('createdBy', 'fullName')
      .populate('maintenanceTeam', 'fullName email')
      .populate('partsUsed.partId', 'itemName');
    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single maintenance record
export const getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate('equipment')
      .populate('technician', 'fullName email')
      .populate('maintenanceTeam', 'fullName email')
      .populate('partsUsed.partId');
    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }
    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Kanban board data
export const getKanbanBoard = async (req, res) => {
  try {
    const statuses = ['New', 'In Progress', 'Repaired', 'Scrap'];
    const board = {};

    for (const status of statuses) {
      const records = await Maintenance.find({ status })
        .populate('equipment', 'assetName')
        .populate('technician', 'fullName')
        .populate('team', 'teamName')
        .populate('maintenanceTeam', 'fullName');
      board[status] = records;
    }

    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create maintenance record
export const createMaintenance = async (req, res) => {
  try {
    const { 
      equipment, 
      workspace,
      maintenanceCategory,
      type, 
      priority,
      description,
      notes,
      requestDate,
      scheduledDate, 
      technician,
      team,
      company,
      partsUsed 
    } = req.body;

    if (!maintenanceCategory || !type) {
      return res.status(400).json({ error: 'maintenanceCategory and type are required' });
    }

    // Validate that equipment or workspace is provided based on maintenanceCategory
    if (maintenanceCategory === 'Equipment' && !equipment) {
      return res.status(400).json({ error: 'equipment is required for Equipment maintenance' });
    }
    if (maintenanceCategory === 'Workspace' && !workspace) {
      return res.status(400).json({ error: 'workspace is required for Workspace maintenance' });
    }

    const maintenance = new Maintenance({
      equipment: maintenanceCategory === 'Equipment' ? equipment : null,
      workspace: maintenanceCategory === 'Workspace' ? workspace : null,
      maintenanceCategory,
      type,
      priority: priority || 'Moderate',
      description,
      notes,
      requestDate: requestDate || Date.now(),
      scheduledDate,
      technician,
      team,
      company,
      maintenanceTeam: [],
      partsUsed: partsUsed || [],
      createdBy: req.userId
    });

    await maintenance.save();
    await maintenance.populate('equipment', 'assetName');
    await maintenance.populate('technician', 'fullName email');
    await maintenance.populate('team', 'teamName');
    await maintenance.populate('maintenanceTeam', 'fullName email');

    // Emit Socket.io event
    if (req.app.io) {
      req.app.io.emit('maintenance-created', {
        id: maintenance._id,
        asset: equipment ? 'Equipment' : workspace,
        type: maintenance.type,
        priority: maintenance.priority,
        status: maintenance.status
      });
    }

    res.status(201).json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update maintenance record
export const updateMaintenance = async (req, res) => {
  try {
    const { status, partsUsed, cost } = req.body;
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    // Validate status transition
    const validTransitions = {
      'New': ['In Progress'],
      'In Progress': ['Repaired', 'Scrap'],
      'Repaired': [],
      'Scrap': []
    };

    if (status && !validTransitions[maintenance.status]?.includes(status)) {
      return res.status(400).json({
        error: `Invalid status transition: ${maintenance.status} → ${status}`
      });
    }

    // Update fields
    if (status) {
      maintenance.status = status;
      if (status === 'Repaired') {
        maintenance.completionDate = new Date();
        // Deduct inventory
        if (partsUsed && partsUsed.length > 0) {
          for (const part of partsUsed) {
            await Inventory.findByIdAndUpdate(
              part.partId,
              { $inc: { quantityOnHand: -part.quantityUsed } },
              { new: true }
            );
          }
        }
      } else if (status === 'Scrap') {
        // Mark equipment as scrapped
        await Equipment.findByIdAndUpdate(
          maintenance.equipment,
          { status: 'Scrapped', condition: 'Scrap' }
        );
      }
    }

    if (cost) maintenance.cost = cost;
    if (partsUsed) maintenance.partsUsed = partsUsed;

    await maintenance.save();
    await maintenance.populate('equipment', 'assetName');

    // Emit Socket.io event
    if (req.app.io) {
      req.app.io.emit('maintenance-status-updated', {
        maintenanceId: maintenance._id,
        status: maintenance.status,
        equipment: maintenance.equipment.assetName
      });
    }

    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete maintenance record
export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }
    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
