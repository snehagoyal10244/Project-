import express from 'express';
import {
  getProducts,
  getProductById,
  getTrendingProducts,
  getBestSellers,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/filter/trending', getTrendingProducts);
router.get('/filter/bestsellers', getBestSellers);
router.get('/filter/new-arrivals', getNewArrivals);

router.route('/:idOrSlug')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
