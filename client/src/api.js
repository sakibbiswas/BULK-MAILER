const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function handleFetch(res) {
  if (!res.ok) {
    try {
      const json = await res.json();
      throw new Error(json.error || 'Failed');
    } catch (e) {
      throw new Error(res.statusText || 'Failed to fetch');
    }
  }
  return res.json();
}

export async function createJob({ csvFile, subject, html, from }) {
  const form = new FormData();
  form.append('csv', csvFile);
  form.append('subject', subject);
  form.append('html', html);
  if (from) form.append('from', from);
  try {
    const res = await fetch(`${API}/jobs`, { method: 'POST', body: form });
    return await handleFetch(res);
  } catch (err) {
    console.error('createJob error:', err);
    throw err;
  }
}

export async function listJobs() {
  try {
    const res = await fetch(`${API}/jobs`);
    return await handleFetch(res);
  } catch (err) {
    console.error('listJobs error:', err);
    return [];
  }
}
export async function getJob(id) {
  try {
    const res = await fetch(`${API}/jobs/${id}`);
    return await handleFetch(res);
  } catch (err) {
    console.error('getJob error:', err);
    return null;
  }
}