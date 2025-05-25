const nodemailer = require("nodemailer")

// Create transporter with your Gmail configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number.parseInt(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error)
  } else {
    console.log("Email service is ready to send messages")
  }
})

// Email templates
const emailTemplates = {
  employerApproved: (employerName) => ({
    subject: "🎉 Your Employer Account Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">TalentConnect</h1>
          </div>
          
          <h2 style="color: #059669; text-align: center; margin-bottom: 20px;">🎉 Congratulations!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear ${employerName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            We're excited to inform you that your employer account has been <strong>approved</strong> and is now active on TalentConnect!
          </p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2563eb; margin-top: 0;">You can now:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>✅ Post unlimited job listings</li>
              <li>✅ View and manage job applications</li>
              <li>✅ Access your employer dashboard</li>
              <li>✅ Connect with talented professionals</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/employer/dashboard" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for choosing TalentConnect to find talented professionals for your team.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Best regards,<br>
            <strong>The TalentConnect Team</strong><br>
            <a href="${process.env.FRONTEND_URL}" style="color: #2563eb;">www.talentconnect.com</a>
          </p>
        </div>
      </div>
    `,
  }),

  employerRejected: (employerName, reason) => ({
    subject: "Update on Your Employer Account Application",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">TalentConnect</h1>
          </div>
          
          <h2 style="color: #dc2626; text-align: center; margin-bottom: 20px;">Account Application Update</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear ${employerName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for your interest in joining TalentConnect as an employer.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            After reviewing your application, we are unable to approve your account at this time.
          </p>
          
          ${
            reason
              ? `
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p style="margin: 0; color: #374151;"><strong>Reason:</strong> ${reason}</p>
            </div>
          `
              : ""
          }
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            If you believe this is an error or would like to reapply with additional information, please contact our support team.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${process.env.EMAIL_USER}" 
               style="background-color: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Contact Support
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Best regards,<br>
            <strong>The TalentConnect Team</strong>
          </p>
        </div>
      </div>
    `,
  }),

  applicationStatusUpdate: (candidateName, jobTitle, status, companyName) => ({
    subject: `📋 Application Update: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">TalentConnect</h1>
          </div>
          
          <h2 style="color: #2563eb; text-align: center; margin-bottom: 20px;">📋 Application Status Update</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear ${candidateName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            We have an update regarding your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
          </p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 18px; color: #374151;">
              <strong>Status:</strong> 
              <span style="color: ${status === "hired" ? "#059669" : status === "interview" ? "#2563eb" : status === "rejected" ? "#dc2626" : "#6b7280"}; font-weight: bold; text-transform: capitalize;">
                ${status}
              </span>
            </p>
          </div>
          
          ${
            status === "interview"
              ? `
            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <p style="margin: 0; color: #374151;">🎉 <strong>Congratulations!</strong> The employer is interested in scheduling an interview with you. They will contact you soon with more details.</p>
            </div>
          `
              : ""
          }
          
          ${
            status === "hired"
              ? `
            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <p style="margin: 0; color: #374151;">🎉 <strong>Congratulations!</strong> You have been selected for this position. The employer will contact you with next steps.</p>
            </div>
          `
              : ""
          }
          
          ${
            status === "rejected"
              ? `
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p style="margin: 0; color: #374151;">Thank you for your interest in this position. While you were not selected for this role, we encourage you to continue applying for other opportunities on our platform.</p>
            </div>
          `
              : ""
          }
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/user/dashboard" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Best regards,<br>
            <strong>The TalentConnect Team</strong>
          </p>
        </div>
      </div>
    `,
  }),

  welcomeJobSeeker: (candidateName) => ({
    subject: "🎉 Welcome to TalentConnect!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">TalentConnect</h1>
          </div>
          
          <h2 style="color: #059669; text-align: center; margin-bottom: 20px;">🎉 Welcome to TalentConnect!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear ${candidateName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Welcome to TalentConnect! We're excited to have you join our community of talented professionals.
          </p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2563eb; margin-top: 0;">Get started by:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>✅ Completing your profile</li>
              <li>✅ Uploading your resume</li>
              <li>✅ Browsing available jobs</li>
              <li>✅ Applying to positions that match your skills</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/jobs" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">
              Browse Jobs
            </a>
            <a href="${process.env.FRONTEND_URL}/profile" 
               style="background-color: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Complete Profile
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Best regards,<br>
            <strong>The TalentConnect Team</strong><br>
            <a href="${process.env.FRONTEND_URL}" style="color: #2563eb;">www.talentconnect.com</a>
          </p>
        </div>
      </div>
    `,
  }),
}

// Send email function
const sendEmail = async (to, templateName, ...args) => {
  try {
    if (!emailTemplates[templateName]) {
      throw new Error(`Email template '${templateName}' not found`)
    }

    const emailContent = emailTemplates[templateName](...args)

    const mailOptions = {
      from: `"TalentConnect" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", {
      messageId: result.messageId,
      to: to,
      subject: emailContent.subject,
    })
    return result
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

// Test email function
const testEmailConnection = async () => {
  try {
    await transporter.verify()
    console.log("✅ Email service connection verified successfully")
    return true
  } catch (error) {
    console.error("❌ Email service connection failed:", error)
    return false
  }
}

module.exports = {
  sendEmail,
  emailTemplates,
  testEmailConnection,
}
