import nodemailer from 'nodemailer';

// Initialize Gmail transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // Use Gmail App Password, not your real password
  }
});

export async function sendPasswordResetEmail(email, resetToken, username) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Bacaro Budget Manager" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - Bacaro Budget Manager',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${username},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}"
             style="background-color: #4CAF50; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 4px; font-size: 16px;">
            Reset Password
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour for security reasons.
        </p>

        <p style="color: #666; font-size: 12px;">
          If you didn't request this reset, please ignore this email. Your account remains secure.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          © Bacaro Budget Manager. All rights reserved.
        </p>
      </div>
    `,
    text: `
      Password Reset Request

      Click the following link to reset your password:
      ${resetLink}

      This link will expire in 1 hour.

      If you didn't request this reset, please ignore this email.
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send password reset email');
  }
}

export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('Email service ready');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}