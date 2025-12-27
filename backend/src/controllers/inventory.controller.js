import Inventory from '../models/Inventory.js';

// Get all inventory items
export const getAllInventory = async (req, res) => {
  try {
    let inventory = await Inventory.find()
      .populate('supplier', 'supplierName')
      .populate('linkedEquipment', 'assetName');

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
      inventory = await Inventory.find()
        .populate('supplier', 'supplierName')
        .populate('linkedEquipment', 'assetName');
    }

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single inventory item
export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('supplier')
      .populate('linkedEquipment');
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create inventory item
export const createInventory = async (req, res) => {
  try {
    const { itemName, category, quantityOnHand, minimumThreshold, costPerUnit, supplier, status } = req.body;

    if (!itemName) {
      return res.status(400).json({ error: 'itemName is required' });
    }

    // Auto-determine status based on quantity
    let itemStatus = status;
    if (!itemStatus) {
      if (quantityOnHand === 0) {
        itemStatus = 'Out of Stock';
      } else if (quantityOnHand < (minimumThreshold || 0)) {
        itemStatus = 'Low Stock';
      } else {
        itemStatus = 'In Stock';
      }
    }

    const inventory = new Inventory({
      itemName,
      category,
      quantityOnHand: quantityOnHand || 0,
      minimumThreshold: minimumThreshold || 0,
      status: itemStatus,
      costPerUnit,
      supplier
    });

    await inventory.save();
    await inventory.populate('supplier', 'supplierName');

    res.status(201).json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update inventory item
export const updateInventory = async (req, res) => {
  try {
    // First fetch current item to get existing values
    const currentItem = await Inventory.findById(req.params.id);
    if (!currentItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    let updateData = { ...req.body, updatedAt: Date.now() };

    // Auto-determine status based on quantity
    const qty = req.body.quantityOnHand !== undefined ? req.body.quantityOnHand : currentItem.quantityOnHand;
    const threshold = req.body.minimumThreshold !== undefined ? req.body.minimumThreshold : currentItem.minimumThreshold;

    // Only auto-set status if user didn't explicitly provide one
    if (!req.body.status) {
      if (qty === 0) {
        updateData.status = 'Out of Stock';
      } else if (qty < threshold) {
        updateData.status = 'Low Stock';
      } else {
        updateData.status = 'In Stock';
      }
    }

    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('supplier', 'supplierName');

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Emit low stock alert if below threshold
    if (req.app.io && inventory.quantityOnHand < inventory.minimumThreshold) {
      req.app.io.emit('low-inventory-alert', {
        itemId: inventory._id,
        itemName: inventory.itemName,
        currentQuantity: inventory.quantityOnHand,
        threshold: inventory.minimumThreshold,
        status: inventory.status
      });
    }

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete inventory item
export const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
