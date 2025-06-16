// routes/adminRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { getAllUsers, updateUser, deleteUser } from '../controllers/adminController.js';
import { getAllBookings } from '../controllers/bookingController.js';

const router = express.Router();

// User management
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id', protect, isAdmin, updateUser);
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Bookings
router.get('/bookings', protect, isAdmin, getAllBookings);

export default router;

