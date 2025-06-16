import express from 'express';
import { registerUser, loginUser, viewAllUsers, viewUserById, updateUser, deleteUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Admin-only routes (protected by authentication middleware)
router.get('/users', authenticate, viewAllUsers); // Get all users
router.get('/users/:id', authenticate, viewUserById); // Get user by ID
router.put('/users/:id', authenticate, updateUser); // Update user
router.delete('/users/:id', authenticate, deleteUser); // Delete user

export default router;