# Password Reset with Email - Setup Guide

## 🚀 Complete Implementation

This implementation provides a secure password reset system with email verification using Gmail SMTP.

## 📋 Features Implemented

✅ **Forgot Password Page** - Form to request password reset
✅ **Email Sending** - Professional HTML emails via Gmail SMTP
✅ **Reset Password Page** - Secure token-based password reset
✅ **Security Features** - Token expiration, rate limiting, bcrypt hashing
✅ **Database Schema** - PostgreSQL tables for reset tokens
✅ **Frontend Integration** - Updated login modal with forgot password link

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install nodemailer bcrypt
```

### 2. Gmail SMTP Setup

1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate App Password**:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows"
   - Copy the 16-character password

### 3. Environment Variables

Add these to your Vercel project environment variables:

```bash
DATABASE_URL=postgresql://your_db_connection_string
AUTH_SECRET=your-secure-random-string
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
FRONTEND_URL=https://yourdomain.com
```

### 4. Database Schema

The system automatically creates the required tables when first used. The schema includes:

- `password_resets` table for storing reset tokens
- Additional columns in `accounts` table for security tracking

### 5. Test the System

1. **Deploy to Vercel** or run locally
2. **Visit** `/forgot-password.html`
3. **Enter an email** and check for the reset email
4. **Click the reset link** and set a new password

## 🔒 Security Features

- **Token Expiration**: Reset links expire in 1 hour
- **One-Use Tokens**: Each token can only be used once
- **Rate Limiting**: Max 3 reset attempts per 15 minutes
- **No Email Leakage**: Generic responses whether email exists or not
- **bcrypt Hashing**: Upgraded from SHA256 for better security
- **IP/User-Agent Tracking**: For security auditing
- **Transaction Safety**: All-or-nothing password updates

## 📁 File Structure

```
api/
├── password-reset.js      # Main API handler
├── email-service.js       # Gmail SMTP service
├── schema.js             # Database schema management
└── migrate-passwords.js  # Migration script

views/
├── forgot-password.html   # Forgot password form
└── reset-password.html    # Reset password form
```

## 🔄 Migration (Optional)

To upgrade existing SHA256 passwords to bcrypt:

```bash
node api/migrate-passwords.js
```

This will automatically detect and migrate SHA256 hashes to bcrypt.

## 🧪 Testing Checklist

- [ ] Forgot password form accepts email
- [ ] Email is sent successfully
- [ ] Reset link works and validates token
- [ ] Password reset updates database
- [ ] Token expires after 1 hour
- [ ] Invalid tokens are rejected
- [ ] Rate limiting works
- [ ] Password strength indicator functions

## 🚨 Important Notes

1. **Gmail App Password**: Never use your real Gmail password
2. **HTTPS Required**: Email links must use HTTPS in production
3. **Environment Variables**: Keep Gmail credentials secure
4. **Rate Limiting**: Prevents abuse of the reset system
5. **Token Security**: Tokens are hashed before storage

## 🐛 Troubleshooting

**Email not sending?**
- Check Gmail App Password is correct
- Verify 2FA is enabled
- Check Vercel environment variables

**Database errors?**
- Ensure DATABASE_URL is correct
- Check Neon database permissions
- Run schema creation manually if needed

**Token validation fails?**
- Check FRONTEND_URL matches your domain
- Verify token hasn't expired
- Check database connection

## 📧 Email Template

The system sends professional HTML emails with:
- Company branding
- Clear call-to-action button
- Security warnings
- Expiration notices
- Plain text fallback

## 🔐 Production Considerations

- Use HTTPS for all reset links
- Monitor email delivery rates
- Set up email bounce handling
- Consider email verification for new accounts
- Implement account lockout policies
- Add CAPTCHA for high-traffic sites