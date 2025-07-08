import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};
console.log('Trying to send mail...');
(async () => {
  await sendEmail({
    to: 'example@example.com',
    subject: 'Test Email',
    text: 'This is a test email.',
  });
  console.log('Mail function finished.');
})();