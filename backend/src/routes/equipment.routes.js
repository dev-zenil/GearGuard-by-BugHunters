import express from 'express';
import {
  getAllEquipment,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipment.controller.js';

const router = express.Router();

router.get('/', getAllEquipment);
router.get('/:id', getEquipment);
router.post('/', createEquipment);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;
