import express from 'express';
import multer from 'multer';
import { createPortfolioItem, getAllPortfolioItems, deletePortfolioItem,  updatePortfolioItem,
} from '../controllers/portfolioController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';


const router = express.Router();

// Setup multer for image upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.post('/', authenticate, isAdmin, upload.single('image'), createPortfolioItem);
router.get('/', getAllPortfolioItems);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  upload.single('image'), // optional image update
  updatePortfolioItem
);
router.delete('/:id',  authenticate,isAdmin, deletePortfolioItem);

export default router;
