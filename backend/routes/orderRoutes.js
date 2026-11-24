import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public route for instant order tracking
router.get('/track/:code', trackOrder);

// Authenticated routes
router.route('/')
  .post(protect, createOrder)
  .get(protect, getUserOrders);

router.route('/:idOrOrderNumber')
  .get(protect, getOrderById);

router.put('/:id/cancel', protect, cancelOrder);

// Admin status update
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
