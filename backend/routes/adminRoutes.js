import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  getAllCustomers,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/customers', getAllCustomers);

export default router;
