# Email Configuration Guide

This guide helps you set up SMTP email configuration for password reset functionality in Luminous CRM.

## Environment Variables Required

Add these variables to your Railway backend service:

```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password-or-app-password
EMAIL_FROM=noreply@yourdomain.com
```

## Popular Email Provider Configurations

### 1. Gmail (Recommended for Development)

**Requirements:**
- Gmail account
- App Password (not your regular Gmail password)

**Steps:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: Go to Google Account Settings → Security → App passwords
3. Use these settings:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
EMAIL_FROM=your-gmail@gmail.com
```

### 2. Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

### 3. Custom Domain (e.g., cPanel, Hostinger)

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-email-password
EMAIL_FROM=noreply@yourdomain.com
```

### 4. SendGrid (Production Recommended)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## Setup Instructions

### Step 1: Configure Railway Environment Variables

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to "Variables" tab
4. Add all the SMTP environment variables listed above

### Step 2: Test Email Configuration

After deploying, the system will automatically test the email configuration on startup. Check your Railway logs for:

```
✅ Email configuration is valid
```

If you see an error, check your email provider settings.

### Step 3: Test Password Reset

1. Go to your frontend `/forgot-password` page
2. Enter a valid email address
3. Check the email inbox for the password reset email
4. Click the reset link and test the flow

## Email Templates

The system sends beautifully formatted HTML emails with:

- **Password Reset Email**: Professional template with reset button
- **Welcome Email**: Greeting email for new users (optional)
- **Responsive Design**: Works on all devices
- **Brand Colors**: Uses your Luminous CRM primary colors

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check username/password
   - For Gmail, ensure you're using an App Password, not your regular password

2. **"Connection timeout"**
   - Check SMTP_HOST and SMTP_PORT
   - Ensure Railway can reach your email provider

3. **"Self-signed certificate"**
   - Set SMTP_SECURE=false for most providers
   - Set SMTP_SECURE=true only for port 465

4. **Emails not arriving**
   - Check spam folder
   - Verify EMAIL_FROM is a valid sender address
   - Some providers require sender verification

### Gmail App Password Setup:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (must be enabled)
3. Security → App passwords
4. Select "Mail" and your device
5. Copy the 16-character password (no spaces)

## Production Recommendations

For production use, consider:

1. **Custom Domain**: Use your own domain for sender address
2. **SendGrid/AWS SES**: More reliable than Gmail for bulk emails
3. **Domain Authentication**: Set up SPF, DKIM, and DMARC records
4. **Rate Limiting**: Monitor email sending rates

## Security Notes

- Never commit email credentials to git
- Use app passwords instead of regular passwords when possible
- Consider IP whitelisting for production
- Monitor email sending logs for suspicious activity

---

Once configured, your password reset emails will be sent automatically when users request them!