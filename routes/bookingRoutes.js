import express from 'express';
import {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController.js';

import { protect } from '../middleware/auth.middleware.js';
import {upload} from '../middleware/uploadMiddleware.js';
// import { updateSessionDate } from '../controllers/bookingController.js';


const router = express.Router();

router.post('/', upload.single('referenceImage'), createBooking);
router.get('/', protect, getAllBookings);
router.patch('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);
// router.post('/:id/session', updateSessionDate);


export default router;
