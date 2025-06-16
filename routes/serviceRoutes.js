import express from 'express';
import { createService, getServices, deleteService } from '../controllers/serviceController.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getServices); // Public
router.post('/', protect, isAdmin, createService); // Admin only
router.delete('/:id', protect, isAdmin, deleteService); // Admin only

export default router;
