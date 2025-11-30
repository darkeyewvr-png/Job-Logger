
import React, { useState, useEffect } from 'react';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import type { Job } from './types';
import { GithubIcon } from './components/icons';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('userEmail') || 'your-email@example.com');
  const [recipientEmail, setRecipientEmail] = useState<string>(() => localStorage.getItem('recipientEmail') || 'work-email@example.com');

  useEffect(() => {
    localStorage.setItem('userEmail', userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem('recipientEmail', recipientEmail);
  }, [recipientEmail]);


  const addJob = (jobData: Omit<Job, 'id'>) => {
    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID(),
    };
    setJobs((prevJobs) => {
      const updated = [newJob, ...prevJobs];
      return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });
  };

  const updateJob = (updatedJob: Job) => {
    setJobs((prevJobs) => {
      const updated = prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job));
      return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Tradesperson's Job Logger
            </h1>
            <a href="https://github.com/google-gemini/generative-ai-samples/tree/main/demos/react-job-logger" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <GithubIcon className="h-6 w-6" />
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="w-full sm:w-auto flex-1">
              <label htmlFor="userEmail" className="block text-xs font-medium text-slate-600 dark:text-slate-400">Your Email (for signature)</label>
              <input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="your-email@example.com"
              />
            </div>
            <div className="w-full sm:w-auto flex-1">
              <label htmlFor="recipientEmail" className="block text-xs font-medium text-slate-600 dark:text-slate-400">Recipient Email (for sending)</label>
              <input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="work-email@example.com"
              />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <JobForm onAddJob={addJob} />
          </div>
          <div className="lg:col-span-2">
            <JobList jobs={jobs} userEmail={userEmail} recipientEmail={recipientEmail} onUpdateJob={updateJob} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
