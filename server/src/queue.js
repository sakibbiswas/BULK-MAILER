
import Handlebars from 'handlebars';
import { sendEmail } from './mailer.js';
import { saveJob } from './db.js';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export function createQueue({ transporter, from, concurrency = 5, retryLimit = 2, retryDelayMs = 5000 }) {
  let running = 0;
  const pending = [];

  async function runNext() {
    if (running >= concurrency) return;
    const task = pending.shift();
    if (!task) return;
    running++;
    try {
      await task();
    } finally {
      running--;
      setImmediate(runNext);
    }
  }

  async function enqueue(job, recipients, subject, htmlTemplate) {
    const template = Handlebars.compile(htmlTemplate || '');

    recipients.forEach((r, idx) => {
      pending.push(async () => {
        if (r.status === 'sent') return;
        let attempts = r.attempts || 0;
        while (attempts <= retryLimit) {
          try {
            // Pass CSV row directly as template variables
            const html = template(r);
            await sendEmail(transporter, { from, to: r.email, subject, html });
            r.status = 'sent';
            r.attempts = attempts + 1;
            r.error = null;
            job.sent = (job.sent || 0) + 1;
            saveJob(job);
            break;
          } catch (err) {
            attempts++;
            r.attempts = attempts;
            r.error = err?.message || String(err);
            saveJob(job);
            if (attempts > retryLimit) {
              r.status = 'failed';
              break;
            }
            await sleep(retryDelayMs);
          }
        }
      });
    });

    for (let i = 0; i < concurrency; i++) setImmediate(runNext);
  }

  return { enqueue };
}





// import { sendEmail } from './mailer.js';
// import { saveJob } from './db.js';

// function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// export function createQueue({ concurrency = 5, retryLimit = 2, retryDelayMs = 3000 }) {
//   let running = 0;
//   const pending = [];

//   async function runNext() {
//     if (running >= concurrency) return;
//     const task = pending.shift();
//     if (!task) return;
//     running++;
//     try { await task(); } finally { running--; setImmediate(runNext); }
//   }

//   function enqueue(job, transporter, from) {
//     job.recipients.forEach((r, idx) => {
//       pending.push(async () => {
//         if (r.status === 'sent') return;
//         let attempts = r.attempts || 0;
//         while (attempts < retryLimit) {
//           try {
//             await sendEmail(transporter, {
//               from,
//               to: r.email,
//               subject: job.subject,
//               html: job.html,
//               variables: r.data || {}
//             });
//             r.status = 'sent';
//             r.attempts = attempts + 1;
//             r.error = null;
//             job.sent++;
//             saveJob(job);
//             break;
//           } catch (err) {
//             attempts++;
//             r.attempts = attempts;
//             r.error = err.message;
//             saveJob(job);
//             if (attempts >= retryLimit) r.status = 'failed';
//             else await sleep(retryDelayMs);
//           }
//         }
//       });
//     });
//     for (let i = 0; i < concurrency; i++) setImmediate(runNext);
//   }

//   return { enqueue };
// }
