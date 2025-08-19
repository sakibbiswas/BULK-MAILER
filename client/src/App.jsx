import React, { useState } from 'react';
import UploadForm from './components/UploadForm.jsx';
import JobList from './components/JobList.jsx';

export default function App() {
  const [createdId, setCreatedId] = useState('');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Bulk Mailer</h1>
      <p className="mb-6 text-gray-700">
        Upload a CSV and send personalized emails using Handlebars placeholders like{' '}
        <code>{"{{name}}"}</code>.
      </p>
      <UploadForm onCreated={setCreatedId} />
      <hr className="my-6" />
      <JobList createdId={createdId} />
    </div>
  );
}
