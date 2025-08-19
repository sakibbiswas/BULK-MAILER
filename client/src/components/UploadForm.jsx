import React, { useState } from 'react';
import { createJob } from '../api';

export default function UploadForm({ onCreated }) {
  const [csv, setCsv] = useState(null);
  const [subject, setSubject] = useState('Hello {{name}}');
  const [from, setFrom] = useState('');
  const [html, setHtml] = useState(`<div><p>Dear {{name}},</p><p>This is a test bulk email.</p></div>`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!csv) return setError('Please choose a CSV file');
    try {
      setLoading(true);
      const res = await createJob({ csvFile: csv, subject, html, from });
      onCreated(res.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-3xl">
      <div>
        <label className="block mb-1 font-semibold">CSV File (headers: email, name, ...)</label>
        <input type="file" accept=".csv" onChange={e => setCsv(e.target.files?.[0] || null)} className="border p-2 w-full rounded" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">From (optional)</label>
        <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Your Name <you@domain>" className="border p-2 w-full rounded" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Subject</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} className="border p-2 w-full rounded" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">HTML Template</label>
        <textarea value={html} onChange={e => setHtml(e.target.value)} rows={8} className="border p-2 w-full rounded" />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {loading ? 'Creating…' : 'Create & Send'}
      </button>
    </form>
  );
}







// import React, { useState } from 'react';
// import { createJob } from '../api';

// export default function UploadForm({ onCreated }) {
//   const [csv, setCsv] = useState(null);
//   const [subject, setSubject] = useState('Hello {{name}}');
//   const [from, setFrom] = useState('');
//   const [html, setHtml] = useState(
//     `<div><p>Dear {{name}},</p><p>This is a test bulk email.</p></div>`
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     if (!csv) return setError('Please choose a CSV file');

//     try {
//       setLoading(true);

//       // Call backend API
//       const res = await createJob({ csvFile: csv, subject, html, from });

//       // Notify parent component with new job ID
//       onCreated(res.id);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="grid gap-4 max-w-3xl">
//       <div>
//         <label className="block mb-1 font-semibold">
//           CSV File (headers: email, name, ...)
//         </label>
//         <input
//           type="file"
//           accept=".csv"
//           onChange={e => setCsv(e.target.files?.[0] || null)}
//           className="border p-2 w-full rounded"
//         />
//       </div>

//       <div>
//         <label className="block mb-1 font-semibold">From (optional)</label>
//         <input
//           value={from}
//           onChange={e => setFrom(e.target.value)}
//           placeholder="Your Name <you@domain>"
//           className="border p-2 w-full rounded"
//         />
//       </div>

//       <div>
//         <label className="block mb-1 font-semibold">Subject</label>
//         <input
//           value={subject}
//           onChange={e => setSubject(e.target.value)}
//           className="border p-2 w-full rounded"
//         />
//       </div>

//       <div>
//         <label className="block mb-1 font-semibold">HTML Template</label>
//         <textarea
//           value={html}
//           onChange={e => setHtml(e.target.value)}
//           rows={8}
//           className="border p-2 w-full rounded"
//         />
//       </div>

//       {error && <div className="text-red-600">{error}</div>}

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         {loading ? 'Creating…' : 'Create & Send'}
//       </button>
//     </form>
//   );
// }




