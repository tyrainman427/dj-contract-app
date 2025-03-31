const functions = require('firebase-functions');
const admin = require('firebase-admin');
const emailjs = require('@emailjs/nodejs');
require('dotenv').config();

admin.initializeApp();
const db = admin.firestore();

exports.sendReminderEmails = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    // ✅ Step 1: Set today's date (testing mode: today, production: +14 days)
    const today = new Date();
    
    // ⚠️ FOR TESTING: use today's date
    const reminderDate = new Date(today); // 👈 Use this to test right now

    // ✅ Format it as YYYY-MM-DD
    const year = reminderDate.getFullYear();
    const month = String(reminderDate.getMonth() + 1).padStart(2, '0');
    const day = String(reminderDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    console.log(`Looking for events on: ${formattedDate}`);

    // ✅ Step 2: Query Firestore for matching eventDate
    const snapshot = await db.collection('contracts')
      .where('eventDate', '==', formattedDate)
      .get();

    if (snapshot.empty) {
      console.log('No reminders to send today.');
      return null;
    }

    // ✅ Step 3: Loop through matching contracts
    for (const doc of snapshot.docs) {
      const data = doc.data();

      try {
        // ✅ Step 4: Send EmailJS reminder
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID,
          process.env.EMAILJS_TEMPLATE_ID,
          {
            client_name: data.clientName,
            client_email: data.email,
            event_date: data.eventDate,
            event_type: data.eventType,
            total_due: `$${calculateTotal(data)}`,
          },
          { publicKey: process.env.EMAILJS_USER_ID }
        );

        console.log(`✅ Reminder sent to ${data.email}`);
      } catch (err) {
        console.error(`❌ Error sending reminder to ${data.email}`, err);
      }
    }

    return null;
  });

function calculateTotal(data) {
  let total = 350;
  if (data.lighting) total += 100;
  if (data.photography) total += 150;
  if (data.videoVisuals) total += 100;
  if (data.additionalHours) total += data.additionalHours * 75;
  return total;
}
