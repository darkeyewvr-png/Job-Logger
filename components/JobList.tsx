
import React from 'react';
import type { Job } from '../types';
import JobCard from './JobCard';

interface JobListProps {
  jobs: Job[];
  userEmail: string;
  recipientEmail: string;
  onUpdateJob: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, userEmail, recipientEmail, onUpdateJob }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Job History</h2>
      {jobs.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No jobs logged yet</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by filling out the form.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} userEmail={userEmail} recipientEmail={recipientEmail} onUpdateJob={onUpdateJob} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
