import express from 'express';
import {
  getAllMaintenance,
  getMaintenance,
  getKanbanBoard,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance
} from '../controllers/maintenance.controller.js';

const router = express.Router();

router.get('/', getAllMaintenance);
router.get('/kanban/board', getKanbanBoard);
router.get('/:id', getMaintenance);
router.post('/', createMaintenance);
router.put('/:id', updateMaintenance);
router.delete('/:id', deleteMaintenance);

export default router;
