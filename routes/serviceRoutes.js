import express from 'express';
import {
  createService,
  getServices,
  updateService,
  deleteService
} from '../controllers/serviceController.js';

import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import {upload } from '../middleware/uploadMiddleware.js'

const router = express.Router();

// Public
router.get('/', getServices);

router.post('', protect, isAdmin, upload.single('image'), createService); // ✅ this is KEY
router.put('/:id', protect, isAdmin,upload.single('image'), updateService);
router.delete('/:id', protect, isAdmin, deleteService);

export default router;
