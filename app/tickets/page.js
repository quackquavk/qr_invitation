'use client'
import Link from 'next/link';
import { getAllTickets, initializeTickets } from '../data/tickets';
import { TicketActions } from '../components/TicketActions';
import { QrCode, Download, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function TicketsPage() {
  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    
    const fetchTickets = async () => {
      const fetchedTickets = await getAllTickets();
      setTickets(fetchedTickets);
    };
    fetchTickets();
  },
  []);
  
  const soldTickets = tickets?.filter(ticket => ticket.sold);
  const availableTickets = tickets?.filter(ticket => !ticket.sold);
  const scannedTickets = tickets?.filter(ticket => ticket.scanned);
  
  // Initialize tickets if none exist
  // if (tickets && tickets.length === 0) {
  //   console.log("no tickets found")
  //   await initializeTickets();

  // }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-white via-amber-200 to-amber-400 text-transparent bg-clip-text">
          QR Ticket Management
        </h1>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-white/10">
            <div className="text-4xl font-bold text-white">{tickets?.length}</div>
            <div className="text-zinc-400 text-sm">Total Tickets</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-white/10">
            <div className="text-4xl font-bold text-amber-400">{availableTickets?.length}</div>
            <div className="text-zinc-400 text-sm">Available Tickets</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-white/10">
            <div className="text-4xl font-bold text-emerald-400">{soldTickets?.length}</div>
            <div className="text-zinc-400 text-sm">Sold Tickets</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-white/10">
            <div className="text-4xl font-bold text-blue-400">{scannedTickets?.length}</div>
            <div className="text-zinc-400 text-sm">Scanned Tickets</div>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3">
            <Link 
              href="/scan"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium px-4 py-2.5 rounded-xl transition-all duration-300"
            >
              <QrCode className="w-5 h-5" />
              <span>Scan QR Code</span>
            </Link>
            
            <Link 
              href="/tickets/download"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-medium px-4 py-2.5 rounded-xl transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              <span>Bulk Download QR Codes</span>
            </Link>
            
            <form action={initializeTickets}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-300"
                onClick={(e) => {
                  if (!confirm('This will reset ALL tickets to unsold status. Continue?')) {
                    e.preventDefault();
                  }
                }}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reset All Tickets</span>
              </button>
            </form>
          </div>
        </div>
        
        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl overflow-hidden">
          <div className="bg-zinc-800/80 p-4 border-b border-zinc-700/50">
            <h2 className="text-xl font-bold text-white">All Tickets</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-zinc-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Ticket No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Buyer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Scan Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {tickets?.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">{ticket.number}</td>
                    <td className="px-4 py-3 text-sm">
                      {ticket.sold ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
                          Sold
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-300">
                      {ticket.buyerName || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {ticket.scanned ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                          Scanned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-400 border border-zinc-700">
                          Not Scanned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <TicketActions 
                        ticketId={ticket.id} 
                        isSold={ticket.sold} 
                        ticketNumber={ticket.number}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
} 