import express from 'express';
import {
  getMaintenanceHistory,
  getMaintenanceCosts,
  getInventoryUsage,
  getAssetPerformance
} from '../controllers/report.controller.js';

const router = express.Router();

router.get('/maintenance-history/:equipmentId', getMaintenanceHistory);
router.get('/maintenance-costs', getMaintenanceCosts);
router.get('/inventory-usage', getInventoryUsage);
router.get('/asset-performance', getAssetPerformance);

export default router;
