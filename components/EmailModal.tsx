import React, { useRef, useState, useCallback } from 'react';
import type { Job } from '../types';
import JobSummaryCard from './JobSummaryCard';
import { XIcon, DocumentTextIcon, LoaderIcon, WhatsAppIcon, MailIcon } from './icons';
import { formatJobAsText } from '../utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface EmailModalProps {
  job: Job;
  userEmail: string;
  recipientEmail: string;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ job, userEmail, recipientEmail, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Create a filename-safe date string (YYYY-MM-DD) and a clean filename.
  const dateString = job.timestamp.toISOString().split('T')[0];
  const fileName = `${job.clientName.replace(/\s+/g, '-')}-${dateString}.pdf`;

  const generatePdfAsFile = useCallback(async (name: string): Promise<File | null> => {
    if (!cardRef.current) return null;
    
    try {
        const canvas = await html2canvas(cardRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;
        const margin = 15;
        const contentWidth = pdfWidth - (margin * 2);
        const contentHeight = pdfHeight - (margin * 2);
        let imgWidth = contentWidth;
        let imgHeight = imgWidth / canvasAspectRatio;
        if (imgHeight > contentHeight) {
            imgHeight = contentHeight;
            imgWidth = imgHeight * canvasAspectRatio;
        }
        const x = (pdfWidth - imgWidth) / 2;
        const y = margin;
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        
        const pdfBlob = pdf.output('blob');
        return new File([pdfBlob], name, { type: 'application/pdf' });
    } catch (error) {
        console.error('Error generating PDF file:', error);
        return null;
    }
  }, [cardRef]);

  const handleDownloadPdf = useCallback(async () => {
    setIsDownloading(true);
    const file = await generatePdfAsFile(fileName);
    if (file) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
    setIsDownloading(false);
  }, [fileName, generatePdfAsFile]);

  const handleShareWhatsApp = useCallback(async () => {
    setIsSharing(true);
    const file = await generatePdfAsFile(fileName);
    
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        // Use Web Share API for files
        try {
            await navigator.share({
                files: [file],
                title: 'Job Summary',
                text: `Here is the job summary for ${job.clientName}.`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        // Fallback to text share
        const textSummary = formatJobAsText(job);
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textSummary)}`;
        window.open(whatsappUrl, '_blank');
    }
    setIsSharing(false);
  }, [job, fileName, generatePdfAsFile]);

  const handleSendEmail = () => {
    const subject = `Job Summary: ${job.clientName}`;
    const body = formatJobAsText(job);
    window.location.href = `mailto:${recipientEmail}?cc=${userEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const isLoading = isDownloading || isSharing;
  const loadingText = isDownloading ? 'Generating PDF...' : (isSharing ? 'Preparing to share...' : '');

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Share Job Summary</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 text-center">
            Download this summary or share it directly to your apps.
          </p>
          <div ref={cardRef} className="w-full">
            <JobSummaryCard job={job} />
          </div>
        </main>
        <footer className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 rounded-b-xl">
           <div className="text-sm font-medium text-blue-600 dark:text-blue-400 h-5">
              {isLoading && <span className="flex items-center gap-2"><LoaderIcon className="animate-spin h-4 w-4" /> {loadingText}</span>}
           </div>
           <div className="flex gap-3 flex-wrap justify-end">
              <button 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50"
              >
                <MailIcon className="h-5 w-5" />
                Email
              </button>
               <button
                onClick={handleShareWhatsApp}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 border border-transparent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900 disabled:opacity-50"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50"
              >
                <DocumentTextIcon className="h-5 w-5" />
                PDF
              </button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default EmailModal;