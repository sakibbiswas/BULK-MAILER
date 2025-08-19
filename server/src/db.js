import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'server');
const DATA_PATH = path.join(DATA_DIR, 'data.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({ jobs: [] }, null, 2));

function read() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { jobs: [] };
  }
}

function write(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function getAllJobs() {
  return read().jobs;
}

export function saveJob(job) {
  const db = read();
  const idx = db.jobs.findIndex(j => j.id === job.id);
  if (idx === -1) db.jobs.push(job); else db.jobs[idx] = job;
  write(db);
}

export function getJob(id) {
  return read().jobs.find(j => j.id === id);
}