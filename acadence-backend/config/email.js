import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const createTransporter = () => {
  // Check if using Gmail or Outlook
  const isGmail = process.env.EMAIL_USER?.includes('@gmail.com');
  const isOutlook = process.env.EMAIL_USER?.includes('@outlook.com') || 
                    process.env.EMAIL_USER?.includes('@hotmail.com');
  
  if (isOutlook) {
    return nodemailer.createTransporter({
      service: 'outlook',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // Default to Gmail
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetCode, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Acadence Learning Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code - Acadence',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #9333EA 0%, #A855F7 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .reset-code {
              background: #f8f9fa;
              border: 2px dashed #9333EA;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              color: #9333EA;
              letter-spacing: 5px;
              font-family: monospace;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #9333EA 0%, #A855F7 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${userName || 'User'},</p>
              <p>We received a request to reset your password for your Acadence account. Use the code below to reset your password:</p>
              
              <div class="reset-code">
                <p style="margin: 0 0 10px 0; color: #666;">Your Reset Code:</p>
                <div class="code">${resetCode}</div>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0;">
                  <li>This code will expire in <strong>15 minutes</strong></li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Never share this code with anyone</li>
                </ul>
              </div>

              <p style="margin-top: 30px;">Enter this code on the password reset page to create a new password.</p>
              
              <p style="margin-top: 30px; color: #666;">
                Best regards,<br>
                <strong>The Acadence Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; 2025 Acadence Learning Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${userName || 'User'},

We received a request to reset your password for your Acadence account.

Your Password Reset Code: ${resetCode}

This code will expire in 15 minutes.

If you didn't request this password reset, please ignore this email.

Best regards,
The Acadence Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

export default { sendPasswordResetEmail };
