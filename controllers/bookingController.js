import Booking from '../models/Booking.js';
import sendEmail from '../utils/Email.js';
import cloudinary from '../utils/Cloudinary.js';
import { createGoogleMeetEvent } from '../utils/googleCalendar.js';


// Create Booking
export const createBooking = async (req, res) => {
  try {
    const {
      studioName,
      fullName,
      email,
      address,
      theme,
      reference,
      additionalNotes,
      date
    } = req.body;

    const referenceImage = req.file?.path;       // Cloudinary URL
    const referenceImageId = req.file?.filename; // Cloudinary public_id

    const booking = new Booking({
      studioName,
      fullName,
      email,
      address,
      theme,
      reference,
      additionalNotes,
      referenceImage,
      referenceImageId,
      date, // Adding date here

    });

    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};



// Update Booking Status and Session Date (with confirmation email)
// export const updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, adminMessage, sessionDate } = req.body; // Include sessionDate in the request body

//     // Find the booking by ID
//     const booking = await Booking.findById(id);
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Update the status and session date
//     booking.status = status;
//     if (sessionDate) {
//       booking.date = sessionDate; // Update the session date (date field)
//     }
//     booking.adminMessage = adminMessage || ''; // Optional admin message
//     await booking.save();

//     // Dynamic email content
//     let subject = '';
//     let text = '';

//     // Format the session date
//     const formattedSessionDate = sessionDate ? new Date(sessionDate).toLocaleDateString() : 'TBD';

//     switch (status.toLowerCase()) {
//       case 'accepted':
//         subject = 'Your Booking is Confirmed!';
//         text = `Dear ${booking.fullName},\n\nYour booking for "${booking.theme}" has been confirmed.\nSession date: ${formattedSessionDate}\n\n${adminMessage || 'We look forward to seeing you!'}\n\n- Duskora Team`;
//         break;
//       case 'declined':
//         subject = 'Booking Not Accepted';
//         text = `Dear ${booking.fullName},\n\nUnfortunately, your booking for "${booking.theme}" could not be accepted.\nSession date: ${formattedSessionDate}\n\n${adminMessage || 'Please contact us for alternatives.'}\n\n- Duskora Team`;
//         break;
//       default:
//         subject = 'Booking Status Update';
//         text = `Dear ${booking.fullName},\n\nThe status of your booking has been updated to "${status}".\nSession date: ${formattedSessionDate}\n\n${adminMessage || ''}\n\n- Duskora Team`;
//         break;
//     }

//     // Send Email
//     await sendEmail({ to: booking.email, subject, text });

//     res.status(200).json({ message: 'Booking updated and email sent', booking });
//   } catch (err) {
//     console.error('Error updating booking status and session date:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminMessage, sessionDate } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking fields
    booking.status = status;
    if (sessionDate) {
      booking.date = sessionDate;
    }
    booking.adminMessage = adminMessage || '';

    let meetLink = '';

    // ✅ Generate Google Meet link only if status is accepted and sessionDate is present
    if (status.toLowerCase() === 'accepted' && sessionDate) {
      try {
        meetLink = await createGoogleMeetEvent(booking);
        booking.meetLink = meetLink;
        console.log('✅ Google Meet Link:', meetLink);
      } catch (err) {
        console.error('Google Meet generation failed:', err);
      }
    }

    await booking.save();

    // ✅ Format Email
    const formattedSessionDate = sessionDate
      ? new Date(sessionDate).toLocaleDateString()
      : 'TBD';

    let subject = '';
    let text = '';

    switch (status.toLowerCase()) {
      case 'accepted':
        subject = 'Your Booking is Confirmed! - Duskora Photography';
        text = `Dear ${booking.fullName},

Your booking for "${booking.theme}" has been confirmed.
Session date: ${formattedSessionDate}
Join the session: ${booking.meetLink || 'Will be shared separately.'}

${adminMessage || 'We look forward to seeing you!'}
- Duskora Team`;

        break;
      default:
        subject = 'Booking Status Update';
        text = `Dear ${booking.fullName},

The status of your booking has been updated to "${status}".
Session date: ${formattedSessionDate}

${adminMessage || ''}
- Duskora Team`;
        break;
    }

    // ✅ Send Email
    await sendEmail({ to: booking.email, subject, text });

    res.status(200).json({ message: 'Booking updated and email sent', booking });
  } catch (err) {
    console.error('Error updating booking status and session date:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete Booking (Admin)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Delete image from Cloudinary if exists
    if (booking.referenceImageId) {
      await cloudinary.uploader.destroy(booking.referenceImageId);
    }

    // Delete from DB
    await Booking.findByIdAndDelete(id);

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
