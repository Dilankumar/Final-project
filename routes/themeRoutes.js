// routes/themeRoutes.js
import express from 'express';
const router = express.Router();

// Controller functions (to be written tomorrow)
import { createTheme, getUserTheme } from '../controllers/themeController.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';


// Admin creates theme for user
router.post('/', protect, isAdmin, createTheme);

// User gets their theme
router.get('/:userId', protect, getUserTheme);
export default router;
