const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send interview notification email to candidate
 * @param {string} candidateEmail - Candidate's email address
 * @param {string} candidateName - Candidate's full name
 * @param {string} jobTitle - Title of the job they applied for
 * @param {Object} interviewDetails - Interview details
 * @param {string} interviewDetails.date - Interview date
 * @param {string} interviewDetails.time - Interview time
 * @param {string} interviewDetails.location - Interview location (physical or virtual)
 * @param {string} [interviewDetails.additionalNotes] - Additional notes for the candidate
 */
const sendInterviewNotification = async (
  candidateEmail,
  candidateName,
  jobTitle,
  { date, time, location, additionalNotes }
) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: candidateEmail,
    subject: `Interview Invitation: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Interview Invitation</h2>
        
        <p>Dear ${candidateName},</p>
        
        <p>Congratulations! We are pleased to inform you that you have been selected for an interview for the position of <strong>${jobTitle}</strong>.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Interview Details:</h3>
          <p><strong>📅 Date:</strong> ${date}</p>
          <p><strong>⏰ Time:</strong> ${time}</p>
          <p><strong>📍 Location:</strong> ${location}</p>
          ${additionalNotes ? `<p><strong>📝 Additional Notes:</strong><br>${additionalNotes}</p>` : ''}
        </div>
        
        <p>Please confirm your attendance by replying to this email. If you need to reschedule, please let us know at least 24 hours in advance.</p>
        
        <p>We look forward to meeting with you and discussing your qualifications in detail.</p>
        
        <p>Best regards,<br>The Hiring Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Interview notification sent to ${candidateEmail}`);
  } catch (error) {
    console.error('Error sending interview notification:', error);
    throw new Error('Failed to send interview notification email');
  }
};

module.exports = {
  sendInterviewNotification,
};