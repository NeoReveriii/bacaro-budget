// Test email service connection
import { verifyEmailConnection } from './api/mailer.js';

async function testEmailService() {
  console.log('Testing email service connection...');

  try {
    const isConnected = await verifyEmailConnection();
    if (isConnected) {
      console.log('✅ Email service is ready!');
      console.log('📧 You can now send password reset emails');
    } else {
      console.log('❌ Email service connection failed');
      console.log('🔧 Check your GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
    }
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    console.log('🔧 Make sure you have set up Gmail App Password correctly');
  }
}

testEmailService();