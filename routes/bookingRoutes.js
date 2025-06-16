import express from 'express';
import { createBooking, getAllBookings } from '../controllers/bookingController.js';
import upload from '../middleware/uploadmiddleware.js'; // multer for file uploads
import { authenticate } from '../middleware/auth.middleware.js'; // optional auth
import { userBookSlot } from '../controllers/bookingController.js'; // user booking slot

const router = express.Router();

router.post('/', upload.single('referenceImage'), createBooking);
router.get('/', authenticate, getAllBookings); // Only admin can view all
router.post('/', upload.single('referenceImage'),userBookSlot);

export default router;
