'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

export function AddTicketForm({hidden}) {
  const [numTickets, setNumTickets] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/qr/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numTickets }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage(`Successfully added ${data.tickets.length} tickets!`);
      // Refresh the page data
      router.refresh();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
console.log(hidden)
  return (
    <div  className={`bg-zinc-800/50 p-4 rounded-lg border border-white/10 mb-6 ${hidden ? 'hidden' : ''}`}>
      <h2 className="text-xl font-bold text-white mb-4">Add New Tickets</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1">
          <label htmlFor="numTickets" className="block text-sm font-medium text-zinc-400 mb-1">
            Number of Tickets
          </label>
          <input
            type="number"
            id="numTickets"
            min="1"
            max="1000"
            value={numTickets}
            onChange={(e) => setNumTickets(parseInt(e.target.value, 10))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium px-4 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{isLoading ? 'Adding...' : 'Add Tickets'}</span>
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-green-900/30 text-green-400 border border-green-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
} 