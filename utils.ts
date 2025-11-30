export const formatDuration = (timeIn: string, timeOut: string): string => {
  if (!timeIn || !timeOut) return 'N/A';
  
  const [inHours, inMinutes] = timeIn.split(':').map(Number);
  const [outHours, outMinutes] = timeOut.split(':').map(Number);
  
  const inDate = new Date();
  inDate.setHours(inHours, inMinutes, 0, 0);
  
  const outDate = new Date();
  outDate.setHours(outHours, outMinutes, 0, 0);

  // Handle overnight case
  if (outDate < inDate) {
    outDate.setDate(outDate.getDate() + 1);
  }

  const diffMs = outDate.getTime() - inDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  let durationString = '';
  if (diffHours > 0) {
    durationString += `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }
  if (diffMinutes > 0) {
    if (durationString) durationString += ' ';
    durationString += `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }
  
  return durationString || '0 minutes';
};

import type { Job } from './types';

export const formatJobAsText = (job: Job): string => {
  const duration = formatDuration(job.timeIn, job.timeOut);
  
  const summary = `
--- JOB SUMMARY ---

*Client:* ${job.clientName}
*Address:* ${job.address}
*Date:* ${job.timestamp.toLocaleDateString()}
*Time:* ${job.timeIn} - ${job.timeOut} (${duration})

--- Work Performed ---
${job.description}

${job.materials ? `--- Materials Used ---\n${job.materials}` : ''}
  `.trim();

  return summary;
};
