import express from 'express';
import {
  getProducts,
  getSearchSuggestions,
  getProductByIdentifier,
  getShowcaseProducts,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/collections/showcase', getShowcaseProducts);
router.get('/brands', getBrands);
router.get('/:identifier', getProductByIdentifier);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
