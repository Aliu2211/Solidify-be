import nodemailer from 'nodemailer';
import config from '../config/environment';
import logger from '../utils/logger';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
  });

  /**
   * Send email
   */
  static async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: config.EMAIL_FROM,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      });

      logger.info(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error: any) {
      logger.error(`Email send failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(email: string, name: string, userId: string): Promise<boolean> {
    const subject = 'Welcome to Solidify - SME Carbon Management';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Welcome to Solidify!</h2>
        <p>Hello ${name},</p>
        <p>Your account has been successfully created. Your User ID is: <strong>${userId}</strong></p>
        <p>You can now login and start your journey towards Net Zero Carbon Emissions.</p>
        <h3>What's Next?</h3>
        <ul>
          <li>Complete your organization profile</li>
          <li>Start tracking carbon emissions</li>
          <li>Connect with other SMEs</li>
          <li>Access sustainability resources</li>
        </ul>
        <p>Best regards,<br>The Solidify Team</p>
        <hr>
        <p style="font-size: 12px; color: #666;">Maintaining a carbon absent environment</p>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request - Solidify';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Solidify Team</p>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  }

  /**
   * Send milestone completion email
   */
  static async sendMilestoneEmail(email: string, name: string, milestoneTitle: string): Promise<boolean> {
    const subject = `Milestone Achieved: ${milestoneTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🎉 Congratulations!</h2>
        <p>Hello ${name},</p>
        <p>Your organization has successfully completed a sustainability milestone:</p>
        <div style="background-color: #e8f5e9; padding: 20px; margin: 20px 0; border-left: 4px solid #4CAF50;">
          <h3 style="margin: 0; color: #2e7d32;">${milestoneTitle}</h3>
        </div>
        <p>Keep up the great work on your journey to Net Zero Carbon Emissions!</p>
        <p>Best regards,<br>The Solidify Team</p>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  }
}
