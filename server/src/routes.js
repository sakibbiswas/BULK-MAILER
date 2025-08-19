import express from 'express';
import multer from 'multer';
import dayjs from 'dayjs';
import { parseCSV } from './utils/csv.js';
import { getAllJobs, getJob, saveJob } from './db.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = express.Router();

export default function createRoutes(queue, defaults) {
  router.post('/jobs', upload.single('csv'), async (req, res) => {
    try {
      const { subject, html, from } = req.body;
      if (!req.file) return res.status(400).json({ error: 'CSV file required (headers: email, name, ...)' });
      if (!subject || !html) return res.status(400).json({ error: 'subject and html are required' });

      const rows = parseCSV(req.file.buffer);
      const recipients = rows.map(r => ({ email: r.email, data: r, status: 'pending', attempts: 0, error: null })).filter(r => !!r.email);
      const id = 'job_' + Date.now();
      const job = { id, subject, from: from || defaults.from, createdAt: dayjs().toISOString(), total: recipients.length, sent: 0, recipients };

      saveJob(job);
      await queue.enqueue(job, rows, subject, html);
      return res.json({ id, total: job.total, sent: job.sent });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.get('/jobs', (req, res) => {
    const jobs = getAllJobs().map(j => ({ id: j.id, subject: j.subject, total: j.total, sent: j.sent, createdAt: j.createdAt }));
    res.json(jobs);
  });

  router.get('/jobs/:id', (req, res) => {
    const job = getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });
    res.json(job);
  });

  return router;
}



