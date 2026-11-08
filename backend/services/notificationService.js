/**
 * @file notificationService.js
 * @description Handles sending emails via Nodemailer and logging them to Firestore.
 */
const nodemailer = require('nodemailer');
const { db, serverTimestamp } = require('../config/db');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Generic function to send an email.
 * @param {Object} options - { to, subject, html }
 * @returns {Promise<Object>} { success, error }
 */
async function sendEmail({ to, subject, html }) {
  try {
    // If no SMTP is configured, just log it to the console for testing
    if (!process.env.SMTP_USER) {
      console.log(`\n--- MOCK EMAIL ---\nTo: ${to}\nSubject: ${subject}\nHTML: ${html}\n------------------\n`);
      return { success: true, mock: true };
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"BloodLink" <noreply@bloodlink.local>',
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends the matching email to a donor with Accept/Decline buttons.
 */
async function sendMatchEmail(donor, request, acceptToken, declineToken) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const acceptLink = `${clientUrl}/accept-request?token=${acceptToken}`;
  const declineLink = `${clientUrl}/decline-request?token=${declineToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #d32f2f; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">🩸 Urgent Blood Request</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello <strong>${donor.name}</strong>,</p>
        <p>A patient in <strong>${request.city}</strong> urgently needs <strong>${request.bloodGroup}</strong> blood.</p>
        <p><strong>Hospital:</strong> ${request.hospital}</p>
        <p><strong>Urgency:</strong> ${request.urgency.toUpperCase()}</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${acceptLink}" style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-right: 10px;">Accept & Donate</a>
          <a href="${declineLink}" style="background-color: #757575; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Decline</a>
        </div>
        <p style="font-size: 12px; color: #757575; margin-top: 30px;">If you accept, your phone number and email will be revealed to the requester so they can coordinate with you.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: donor.email,
    subject: `🩸 Urgent: ${request.bloodGroup} blood needed in ${request.city}`,
    html,
  });
}

/**
 * Logs a notification to Firestore for tracking history.
 */
async function logNotification(userId, requestId, type, status) {
  try {
    await db.collection('notifications').add({
      userId,
      requestId,
      type,
      status,
      sentAt: serverTimestamp(),
      respondedAt: null
    });
  } catch (error) {
    console.error('Failed to log notification:', error);
  }
}

/**
 * Sends the contact reveal email to the requester after a donor accepts.
 * @param {string} requesterEmail 
 * @param {Object} donorContact - { name, phone, email }
 */
async function sendContactRevealEmail(requesterEmail, donorContact) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #2e7d32; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">🎉 Donor Found!</h1>
      </div>
      <div style="padding: 20px;">
        <p>Good news! A donor has accepted your request for blood.</p>
        <p>You can now contact the donor directly to coordinate the donation:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Name:</strong> ${donorContact.name}</p>
          <p><strong>Phone:</strong> ${donorContact.phone}</p>
          <p><strong>Email:</strong> ${donorContact.email}</p>
        </div>
        <p style="font-size: 12px; color: #757575; margin-top: 30px;">Please be respectful and contact the donor as soon as possible.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: requesterEmail,
    subject: `🎉 Donor Found for Your Blood Request`,
    html,
  });
}

module.exports = {
  sendEmail,
  sendMatchEmail,
  sendContactRevealEmail, // <-- MUST BE HERE
  logNotification
};