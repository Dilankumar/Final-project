// routes/portfolioRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import {
  createPortfolioItem,
  getAllPortfolioItems
} from '../controllers/portfolioController.js';

const router = express.Router();

// Admin creates portfolio
router.post('/', protect, isAdmin, createPortfolioItem);

// Public access
router.get('/', getAllPortfolioItems);

export default router;
