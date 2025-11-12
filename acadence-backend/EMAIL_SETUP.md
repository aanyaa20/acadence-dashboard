# Email Setup for Password Reset

## Gmail Setup Instructions

To enable email functionality for password reset, follow these steps:

### 1. Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left menu
3. Under "How you sign in to Google", select "2-Step Verification"
4. Follow the steps to enable it

### 2. Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device and enter "Acadence Backend"
4. Click "Generate"
5. Copy the 16-character password (you won't see it again!)

### 3. Update .env File
Open `acadence-backend/.env` and update these values:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Example:**
```env
EMAIL_USER=acadence.noreply@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### 4. Restart Backend Server
After updating .env, restart your backend server for changes to take effect.

## Using Other Email Services

### Outlook/Hotmail
```javascript
service: 'outlook'
```

### Yahoo
```javascript
service: 'yahoo'
```

### Custom SMTP
```javascript
{
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
}
```

## Testing

1. Navigate to `/forgot-password`
2. Enter your email address
3. Click "Send Reset Code"
4. Check your email for the 6-digit code
5. Enter the code and new password

## Fallback Mode

If email configuration is not set up or email sending fails:
- The reset code will be shown in the API response
- The frontend will display it in a toast notification
- This is useful for development/testing without email setup

## Security Notes

- Reset codes expire after 15 minutes
- Codes are hashed before storing in database
- Never commit your .env file with real credentials
- Use environment variables in production
- Consider using services like SendGrid, AWS SES for production

## Troubleshooting

**"Invalid credentials" error:**
- Make sure you're using App Password, not your regular Gmail password
- Check that 2-Step Verification is enabled

**"Less secure app access" message:**
- This is outdated - use App Passwords instead

**Email not received:**
- Check spam/junk folder
- Verify EMAIL_USER is correct
- Ensure App Password is copied correctly (no spaces)
- Check if Gmail is blocking the app

**"Connection timeout" error:**
- Check your internet connection
- Verify firewall settings
- Try using port 465 with secure: true
