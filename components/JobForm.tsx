import React, { useState } from 'react';
import type { Job } from '../types';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon, PlusCircleIcon, LoaderIcon, LocationMarkerIcon } from './icons';

interface JobFormProps {
  onAddJob: (job: Omit<Job, 'id'>) => void;
}

const JobForm: React.FC<JobFormProps> = ({ onAddJob }) => {
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  
  // Initialize with today's date in local YYYY-MM-DD format
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getTodayDateString);
  const [materials, setMaterials] = useState('');
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedText = await generateDescription(description);
      setDescription(generatedText);
    } catch (err) {
      setError('Failed to generate description. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);
    setLocationError(null);
    setCoordinates(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        setAddress(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setIsFetchingLocation(false);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !address || !description || !timeIn || !timeOut || !date) {
      setError('All fields except materials are required.');
      return;
    }

    // Create a local date object from the date string
    const [year, month, day] = date.split('-').map(Number);
    const timestamp = new Date(year, month - 1, day);

    onAddJob({ 
        clientName, 
        address, 
        materials, 
        description, 
        timeIn, 
        timeOut, 
        coordinates,
        timestamp 
    });

    setClientName('');
    setAddress('');
    setMaterials('');
    setDescription('');
    setTimeIn('');
    setTimeOut('');
    setDate(getTodayDateString());
    setCoordinates(null);
    setError(null);
    setLocationError(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg sticky top-24">
      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Log a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Client Name</label>
          <input
            id="clientName"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="relative">
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
           <button
            type="button"
            onClick={handleGetLocation}
            disabled={isFetchingLocation}
            className="absolute top-[29px] right-2 flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 font-semibold py-1 px-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-900/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Get current location"
          >
            {isFetchingLocation ? <LoaderIcon className="animate-spin h-4 w-4" /> : <LocationMarkerIcon className="h-4 w-4" />}
          </button>
        </div>
        {locationError && <p className="text-sm text-red-500 -mt-2">{locationError}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="timeIn" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Time In</label>
                <input
                    id="timeIn"
                    type="time"
                    value={timeIn}
                    onChange={(e) => setTimeIn(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="timeOut" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Time Out</label>
                <input
                    id="timeOut"
                    type="time"
                    value={timeOut}
                    onChange={(e) => setTimeOut(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
        </div>
        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Materials Used (optional)</label>
          <textarea
            id="materials"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 2x4 lumber, 1 box of screws, 1 gallon of paint..."
          />
        </div>
        <div className="relative">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Job Description</label>
           <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter job details or keywords to generate a description..."
            required
          />
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={isGenerating || !description}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold py-1 px-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? <LoaderIcon className="animate-spin h-4 w-4" /> : <SparklesIcon className="h-4 w-4" />}
            <span>{isGenerating ? 'Generating...' : 'AI Suggest'}</span>
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Log Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;