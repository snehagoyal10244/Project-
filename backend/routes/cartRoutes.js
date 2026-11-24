import express from 'express';
import {
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  applyPromoCode,
  removePromoCode,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.route('/')
  .get(getUserCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/item/:itemId')
  .put(updateCartItemQuantity)
  .delete(removeFromCart);

router.route('/promo')
  .post(applyPromoCode)
  .delete(removePromoCode);

export default router;
