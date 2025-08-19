import { createTransporter, sendEmail } from './mailer.js';
import { saveJob } from './db.js';

export async function processJob(job) {
  const transporter = createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  });

  for (const recipient of job.recipients) {
    try {
      // Pass recipient fields directly
      await sendEmail(transporter, {
        from: process.env.SMTP_FROM,
        to: recipient.email,
        subject: job.subject,
        html: job.html,
        variables: recipient // now {{name}}, {{email}}, etc. work
      });
      recipient.status = 'sent';
      recipient.attempts = (recipient.attempts || 0) + 1;
    } catch (err) {
      recipient.status = 'failed';
      recipient.error = err.message;
      recipient.attempts = (recipient.attempts || 0) + 1;
    }
    saveJob(job);
  }
}
