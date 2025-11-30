import React from 'react';
import type { Job } from '../types';
import { formatDuration } from '../utils';
import { LocationMarkerIcon, ClockIcon, ClipboardListIcon, BriefcaseIcon } from './icons';

interface JobSummaryCardProps {
  job: Job;
}

const JobSummaryCard: React.FC<JobSummaryCardProps> = ({ job }) => {
  const duration = formatDuration(job.timeIn, job.timeOut);

  // NOTE: This component intentionally does not use dark mode classes (dark:*)
  // to ensure the generated PNG image is always a consistent light theme.
  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200 text-slate-800">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-blue-600">{job.clientName}</h3>
          <p className="text-sm text-slate-500">{job.timestamp.toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3">
          <LocationMarkerIcon className="h-5 w-5 mt-0.5 text-slate-400 flex-shrink-0" />
          <p className="text-sm text-slate-700">
            {job.address}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ClockIcon className="h-5 w-5 text-slate-400 flex-shrink-0" />
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Time:</span> {job.timeIn} - {job.timeOut} ({duration})
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-start gap-3 mb-2">
            <ClipboardListIcon className="h-5 w-5 mt-0.5 text-slate-400 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-slate-800">Work Performed</h4>
        </div>
        <p className="text-sm text-slate-600 whitespace-pre-wrap ml-8">{job.description}</p>
      </div>

      {job.materials && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-start gap-3 mb-2">
              <BriefcaseIcon className="h-5 w-5 mt-0.5 text-slate-400 flex-shrink-0" />
              <h4 className="text-sm font-semibold text-slate-800">Materials Used</h4>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap ml-8">{job.materials}</p>
        </div>
      )}
    </div>
  );
};

export default JobSummaryCard;