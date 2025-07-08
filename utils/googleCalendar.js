import { google } from 'googleapis';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: 'config/service-account.json',
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export const createGoogleMeetEvent = async (booking) => {
  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const start = dayjs(booking.date).toISOString();
  const end = dayjs(booking.date).add(1, 'hour').toISOString();

  const requestBody = {
    summary: `Session with ${booking.fullName}`,
    description: `Theme: ${booking.theme}, Notes: ${booking.additionalNotes || ''}`,
    start: {
      dateTime: start,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: end,
      timeZone: 'Asia/Kolkata',
    },
    conferenceData: {
      createRequest: {
        requestId: `booking-${booking._id}-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet', // ✅ THIS is what Google expects
        },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      conferenceDataVersion: 1,
      requestBody,
    });

    const meetLink = response.data?.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === 'video'
    )?.uri || '';

    console.log('✅ Google Meet Link:', meetLink);
    return meetLink;
  } catch (error) {
    console.error('❌ Google Meet API error:', error.response?.data?.error?.message || error.message);
    return '';
  }
};
