
import React, { useEffect, useState } from 'react';
import { listJobs, getJob } from '../api';
import * as Handlebars from 'handlebars';

export default function JobList({ createdId }) {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  // Fetch jobs with full details for left column
  async function refreshJobs() {
    const jobSummaries = await listJobs(); // returns partial job info
    // Fetch first recipient to show personalized preview
    const fullJobs = await Promise.all(
      jobSummaries.map(async j => {
        const full = await getJob(j.id);
        return full;
      })
    );
    // Sort by createdAt descending
    setJobs(fullJobs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
  }

  useEffect(() => {
    refreshJobs();
    const interval = setInterval(refreshJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (createdId) setSelected(createdId);
  }, [createdId]);

  useEffect(() => {
    if (!selected) return;
    let interval;
    async function fetchDetails() {
      const d = await getJob(selected);
      setDetail(d);
    }
    fetchDetails();
    interval = setInterval(fetchDetails, 2000);
    return () => clearInterval(interval);
  }, [selected]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Jobs List */}
      <div>
        <h3 className="font-bold mb-2">Jobs</h3>
        <ul className="space-y-2">
          {jobs.map(j => {
            // Use first recipient's name for preview
            const firstRecipient = j.recipients?.[0]?.data || {};
            const template = Handlebars.compile(j.subject || '');
            const previewSubject = template(firstRecipient);

            return (
              <li
                key={j.id}
                className="cursor-pointer p-2 border rounded hover:bg-gray-100"
                onClick={() => setSelected(j.id)}
              >
                <strong>{previewSubject}</strong><br />
                <small>{j.sent}/{j.total} sent</small>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Job Details Table */}
      <div className="md:col-span-2">
        <h3 className="font-bold mb-2">Details</h3>
        {!detail && <div>Select a job…</div>}
        {detail && (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Attempts</th>
                  <th className="border px-2 py-1">Error</th>
                  <th className="border px-2 py-1">Personalized Subject</th>
                </tr>
              </thead>
              <tbody>
                {detail.recipients.map((r, i) => {
                  const template = Handlebars.compile(detail.subject || '');
                  const personalizedSubject = template(r.data || {});
                  return (
                    <tr key={i} className={r.status === 'failed' ? 'bg-red-100' : ''}>
                      <td className="border px-2 py-1">{i + 1}</td>
                      <td className="border px-2 py-1">{r.data?.email || r.email}</td>
                      <td className="border px-2 py-1 capitalize">{r.status}</td>
                      <td className="border px-2 py-1">{r.attempts}</td>
                      <td className="border px-2 py-1 text-red-600">{r.error || ''}</td>
                      <td className="border px-2 py-1">{personalizedSubject}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}





