import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createWelcomeImage } from './createImageWithText.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export class Mailer {
  static async sendEmail(email, password) {

    console.log('📧 Sending email to:', email);

    // Step 1: Generate image with embedded password
    const imagePath = await createWelcomeImage(password);

    const transporter = nodemailer.createTransport({
      service: 'Outlook365', // Use 'Gmail' if using Gmail`
      auth: {
        user: process.env.SMTP_USER,  // or EMAIL_USER if renamed
        pass: process.env.SMTP_PASS,  // or EMAIL_PASS if renamed
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to Jupiter Brother Data Science PVT LTD 👋',
      html: `
        <div style="text-align: center;">
          <img src="cid:overlayedImage" alt="Welcome to IPMS" style="width: 100%;">
        </div>
      `,
      attachments: [
        {
          filename: 'welcome-final.png',
          path: imagePath,
          cid: 'overlayedImage', // matches the cid in img src
        },
      ],
    };

    try {
      transporter.sendMail(mailOptions);
      // console.log('✅ Email sent to:', to);
    } catch (err) {
      console.error('❌ Failed to send email:', err.message);
      throw err;
    }
  }
}


