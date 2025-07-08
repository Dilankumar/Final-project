import express from 'express';
import { registerUser, loginUser, viewAllUsers, viewUserById, updateUser, deleteUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);




//  Logout route – Client can call this to clear localStorage token
// router.post('/logout', (req, res) => {
//     // No actual token removal from server, but client clears it
//     res.status(200).json({ message: 'Logged out successfully' });
//   });
  
export default router;