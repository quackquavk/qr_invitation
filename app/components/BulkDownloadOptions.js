'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

export default function BulkDownloadOptions({ tickets, type }) {
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('zip');
  
  const handleDownload = async () => {
    setLoading(true);
    
    try {
      const filename = `qr-tickets-${type}-${new Date().toISOString().split('T')[0]}.zip`;
      
      // Get ticket IDs for bulk download
      const ticketIds = tickets.map(ticket => ticket.id);
      
      // Create a request for the bulk download
      const response = await fetch('/api/qr/bulk-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketIds,
          format: selectedFormat
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate bulk download');
      }
      
      // Get the blob data
      const blob = await response.blob();
      
      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating bulk download:', error);
      alert('Failed to generate bulk download. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-zinc-400 text-sm">Download Format</label>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2"
        >
          <option value="zip">ZIP Archive</option>
          <option value="pdf">PDF Document</option>
        </select>
      </div>
      
      <button
        onClick={handleDownload}
        disabled={loading || tickets.length === 0}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md ${
          tickets.length === 0
            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        } transition-colors`}
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
            <span>Preparing...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download {tickets.length} QR Codes</span>
          </>
        )}
      </button>
      
      {tickets.length === 0 && (
        <p className="text-zinc-500 text-sm">No tickets available for download in this category.</p>
      )}
    </div>
  );
} 