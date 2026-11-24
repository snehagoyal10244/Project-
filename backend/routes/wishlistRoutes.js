import express from 'express';
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  moveWishlistToCart,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWishlist);

router.post('/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);
router.post('/move-to-cart', moveWishlistToCart);

export default router;
