import nodemailer from 'nodemailer';

function getTransportConfig() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '', 10);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpHost) {
    return {
      host: smtpHost,
      port: Number.isFinite(smtpPort) ? smtpPort : 587,
      secure: (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined
    };
  }

  return {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  };
}

const transporter = nodemailer.createTransport(getTransportConfig());

function getFrontendUrl() {
  const configured = process.env.FRONTEND_URL;
  if (configured) return configured.replace(/\/$/, '');

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return null;
}

export async function sendPasswordResetEmail(email, resetToken, username) {
  const frontendUrl = getFrontendUrl();
  if (!frontendUrl) {
    throw new Error('FRONTEND_URL or VERCEL_URL must be configured');
  }

  if (!process.env.GMAIL_USER && !process.env.SMTP_USER) {
    throw new Error('Missing sender credentials: set GMAIL_USER or SMTP_USER');
  }

  if (!process.env.GMAIL_APP_PASSWORD && !process.env.SMTP_PASS) {
    throw new Error('Missing sender password: set GMAIL_APP_PASSWORD or SMTP_PASS');
  }

  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  const sender = process.env.SMTP_USER || process.env.GMAIL_USER;

  const info = await transporter.sendMail({
    from: `"Bacaro Budget" <${sender}>`,
    to: email,
    subject: 'Password Reset Request - Bacaro Budget',
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
        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 12px;">
          If you didn't request this, please ignore this email. Your account remains secure.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">© Bacaro Budget. All rights reserved.</p>
      </div>
    `,
    text: `Hi ${username},\n\nReset your password here:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.`
  });

  const rejected = Array.isArray(info?.rejected) ? info.rejected : [];
  if (rejected.length > 0) {
    throw new Error(`Email rejected for recipient(s): ${rejected.join(', ')}`);
  }

  return {
    messageId: info?.messageId || null,
    accepted: info?.accepted || []
  };
}

export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}