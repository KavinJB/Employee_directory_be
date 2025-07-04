import nodemailer from 'nodemailer';

export class Mailer {
  static async sendEmail(to, subject, text, html = null) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,  // or EMAIL_USER if renamed
        pass: process.env.SMTP_PASS,  // or EMAIL_PASS if renamed
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    };

    try {
       transporter.sendMail(mailOptions);
      console.log('✅ Email sent to:', to);
    } catch (err) {
      console.error('❌ Failed to send email:', err.message);
      throw err;
    }
  }
}


