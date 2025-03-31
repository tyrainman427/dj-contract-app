const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const emailjs = require('@emailjs/nodejs');

admin.initializeApp();
const db = admin.firestore();

const SERVICE_ID = 'service_9z9konq';
const TEMPLATE_ID = 'template_p87ey1j';
const USER_ID = 'NdEqZMAfDI3DOObLT';

exports.sendTwoWeekReminders = onSchedule("every 24 hours", async (event) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + 14);

  const start = admin.firestore.Timestamp.fromDate(targetDate);
  const end = admin.firestore.Timestamp.fromDate(new Date(targetDate.getTime() + 86400000));

  const snapshot = await db.collection('contracts')
    .where('eventTimestamp', '>=', start)
    .where('eventTimestamp', '<', end)
    .get();

  if (snapshot.empty) {
    logger.info('✅ No reminders to send today.');
    return;
  }

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const templateParams = {
      clientName: data.clientName,
      email: data.email,
      eventDate: data.eventDate,
      venueLocation: data.venueLocation,
      total: data.total
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: USER_ID });
      logger.info(`✅ Reminder sent to ${data.email}`);
    } catch (error) {
      logger.error(`❌ Failed to send email to ${data.email}:`, error);
    }
  }
});

