import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const {
      studioName,
      fullName,
      email,
      address,
      theme,
      reference,
      timeSlot
    } = req.body;

    const referenceImage = req.file?.path; // multer will add image path

    const booking = new Booking({
      studioName,
      fullName,
      email,
      address,
      theme,
      reference,
      timeSlot,
      referenceImage
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// controllers/bookingController.js



export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name email');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

export const userBookSlot = async (req, res) => {
  try {
    const {
      studioName,
      fullName,
      email,
      address,
      theme,
      reference,
      timeSlot
    } = req.body;

    const referenceImage = req.file?.path || ''; // file optional

    const booking = new Booking({
      studioName,
      fullName,
      email,
      address,
      theme,
      reference,
      referenceImage,
      timeSlot
    });

    await booking.save();
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
