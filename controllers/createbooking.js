import sendEmail from '../utils/Email.js';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Enable debugging
  logger: true, // Log SMTP communication
});

export const createBooking = async (req, res) => {
  try {
    const {
      studioName,
      fullName,
      email,
      address,
      theme,
    //   reference,
      additionalNotes
    } = req.body;

    const referenceImage = req.file?.path;

    const booking = new Booking({
      studioName,
      fullName,
      email,
      address,
      theme,
    //   reference,
      additionalNotes,
    //   referenceImage
    });

    await booking.save();

    // Send Confirmation Email to the User
    try {
      console.log('Sending email to:', email);
      await sendEmail({
        to: email,
        subject: 'Duskora - Booking Received',
        text: `Hello ${fullName},

We have received your booking for "${theme}" at "${studioName}".
Our team will contact you shortly.

Thank you for choosing Duskora Photography!

- Duskora Team`,
      });
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(500).json({ message: 'Booking created, but email failed to send' });
    }

    res.status(201).json({ message: 'Booking created and email sent', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Update Session Date
// export const updateSessionDate = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { sessionDate } = req.body;

//     const booking = await Booking.findById(id);
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     booking.sessionDate = sessionDate;
//     await booking.save();

//     res.status(200).json({ message: 'Session date updated', booking });
//   } catch (err) {
//     console.error('Error updating session date:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
