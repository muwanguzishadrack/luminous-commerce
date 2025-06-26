import { createSMTPTransporter } from '@/config/email';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Send email using SMTP
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createSMTPTransporter();
    const emailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from: emailFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`✅ Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${options.to}:`, error);
    throw new Error('Failed to send email');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2d5a5a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2d5a5a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Luminous CRM</h1>
          <h2>Password Reset Request</h2>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for your Luminous CRM account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>This email was sent from Luminous CRM. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Luminous CRM - Password Reset Request

    Hello,

    We received a request to reset your password for your Luminous CRM account.

    Click the link below to reset your password:
    ${resetUrl}

    This link will expire in 1 hour for security reasons.

    If you didn't request a password reset, you can safely ignore this email.

    ---
    This email was sent from Luminous CRM. Please do not reply to this email.
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request - Luminous CRM',
    text: textContent,
    html: htmlContent,
  });
};

// Send welcome email
export const sendWelcomeEmail = async (email: string, firstName: string): Promise<void> => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Luminous CRM</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2d5a5a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2d5a5a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Luminous CRM!</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>Welcome to Luminous CRM! Your account has been successfully created.</p>
          <p>You can now access your dashboard and start managing your business:</p>
          <a href="${loginUrl}" class="button">Access Your Dashboard</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Thank you for choosing Luminous CRM!</p>
        </div>
        <div class="footer">
          <p>This email was sent from Luminous CRM. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Welcome to Luminous CRM!

    Hello ${firstName},

    Welcome to Luminous CRM! Your account has been successfully created.

    You can now access your dashboard at: ${loginUrl}

    If you have any questions, feel free to reach out to our support team.

    Thank you for choosing Luminous CRM!

    ---
    This email was sent from Luminous CRM. Please do not reply to this email.
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to Luminous CRM!',
    text: textContent,
    html: htmlContent,
  });
};