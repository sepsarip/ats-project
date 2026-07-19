import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import logger from '../config/logger.js';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    if (!env.googleAppPassword || !env.googleEmailUser) {
      logger.warn(
        'Email credentials (GOOGLE_EMAIL_USER / GOOGLE_APP_PASSWORD) missing in environment variables. Email sending may fail.',
      );
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.googleEmailUser,
        pass: env.googleAppPassword,
      },
    });
  }
  return transporter;
}

/**
 * Send password reset email to user
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.resetUrl - Password reset URL link
 */
export async function sendResetPasswordEmail({ to, resetUrl }) {
  const mailTransporter = getTransporter();

  const mailOptions = {
    from: `"Banyak Job ATS Platform Support" <${env.googleEmailUser}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
        <h2 style="color: #2563eb; text-align: center;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>You received this email because a password reset request was requested for your account on BanyakJob ATS Platform.</p>
        <p>Click the button below to reset your password. This link is valid for 15 minutes:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4b5563;"><a href="${resetUrl}">${resetUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
  };

  const info = await mailTransporter.sendMail(mailOptions);
  logger.info('Reset password email sent successfully', {
    to,
    messageId: info.messageId,
  });
  return info;
}

export default { sendResetPasswordEmail };
