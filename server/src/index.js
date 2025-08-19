import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createTransporter } from './mailer.js';
import { createQueue } from './queue.js';
import createRoutes from './routes.js';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));

const transporter = createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
});

const queue = createQueue({
  transporter,
  from: process.env.SMTP_FROM,
  concurrency: Number(process.env.CONCURRENCY || 5),
  retryLimit: Number(process.env.RETRY_LIMIT || 2),
  retryDelayMs: Number(process.env.RETRY_DELAY_MS || 5000),
});

app.use('/api', createRoutes(queue, { from: process.env.SMTP_FROM }));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));