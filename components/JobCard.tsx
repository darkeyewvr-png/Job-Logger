
import React, { useState, useEffect } from 'react';
import type { Job } from '../types';
import { LocationMarkerIcon, ClockIcon, ClipboardListIcon, MailIcon, BriefcaseIcon, PencilIcon, CheckIcon, XIcon } from './icons';
import EmailModal from './EmailModal';

interface JobCardProps {
  job: Job;
  userEmail: string;
  recipientEmail: string;
  onUpdateJob: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, userEmail, recipientEmail, onUpdateJob }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<Job>(job);

  useEffect(() => {
    setEditedJob(job);
  }, [job]);

  const mapLink = job.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${job.coordinates.latitude},${job.coordinates.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`;

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [y, m, d] = e.target.value.split('-').map(Number);
    const newDate = new Date(y, m - 1, d);
    setEditedJob({ ...editedJob, timestamp: newDate });
  };

  const handleSave = () => {
    onUpdateJob(editedJob);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedJob(job);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden p-5 border-2 border-blue-500/50">
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Client Name</label>
                    <input 
                        type="text" 
                        value={editedJob.clientName}
                        onChange={(e) => setEditedJob({...editedJob, clientName: e.target.value})}
                        className="mt-1 w-full px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Date</label>
                    <input 
                        type="date"
                        value={formatDateForInput(editedJob.timestamp)}
                        onChange={handleDateChange}
                        className="mt-1 w-full px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm"
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Time In</label>
                    <input 
                        type="time" 
                        value={editedJob.timeIn}
                        onChange={(e) => setEditedJob({...editedJob, timeIn: e.target.value})}
                        className="mt-1 w-full px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Time Out</label>
                    <input 
                        type="time" 
                        value={editedJob.timeOut}
                        onChange={(e) => setEditedJob({...editedJob, timeOut: e.target.value})}
                        className="mt-1 w-full px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Address</label>
                <input 
                    type="text" 
                    value={editedJob.address}
                    onChange={(e) => setEditedJob({...editedJob, address: e.target.value})}
                    className="mt-1 w-full px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Description</label>
                <textarea 
                    value={editedJob.description}
                    onChange={(e) => setEditedJob({...editedJob, description: e.target.value})}
                    rows={3}
                    className="mt-1 w-full px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Materials</label>
                <textarea 
                    value={editedJob.materials}
                    onChange={(e) => setEditedJob({...editedJob, materials: e.target.value})}
                    rows={2}
                    className="mt-1 w-full px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm"
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                    <XIcon className="h-4 w-4" /> Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    <CheckIcon className="h-4 w-4" /> Save Changes
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 ease-in-out group">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{job.clientName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{job.timestamp.toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
                <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                title="Edit Job"
                >
                <PencilIcon className="h-4 w-4" />
                </button>
                <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold py-1.5 px-3 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/80 disabled:opacity-50 transition-colors"
                >
                <MailIcon className="h-4 w-4" />
                <span>Email Summary</span>
                </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <LocationMarkerIcon className="h-5 w-5 mt-0.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 underline decoration-dotted">
                {job.address}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Time:</span> {job.timeIn} - {job.timeOut}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3 mb-2">
                <ClipboardListIcon className="h-5 w-5 mt-0.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Work Performed</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap ml-8">{job.description}</p>
          </div>

          {job.materials && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3 mb-2">
                  <BriefcaseIcon className="h-5 w-5 mt-0.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Materials Used</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap ml-8">{job.materials}</p>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <EmailModal
          job={job}
          userEmail={userEmail}
          recipientEmail={recipientEmail}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default JobCard;
