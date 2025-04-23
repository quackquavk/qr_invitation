'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, ShoppingCart, Download, RotateCcw } from 'lucide-react';
import { markTicketAsSold, resetTicket } from '../data/tickets';
import { useRouter } from 'next/navigation';

export function TicketActions({ ticketId, isSold, ticketNumber }) {
  const [showSellForm, setShowSellForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSellTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await markTicketAsSold(ticketId, formData.name, formData.email);
      setShowSellForm(false);
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error selling ticket:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetTicket = async () => {
    if (!confirm(`Are you sure you want to reset ticket #${ticketNumber}?`)) return;
    
    setLoading(true);
    
    try {
      await resetTicket(ticketId);
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error resetting ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link 
        href={`/ticket/${ticketId}`}
        className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        title="View Ticket"
      >
        <Eye className="w-4 h-4" />
      </Link>
      
      <a 
        href={`/api/qr/ticket/${ticketId}?download=true`}
        download={`ticket-${ticketNumber}.png`}
        className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        title="Download QR Code"
      >
        <Download className="w-4 h-4" />
      </a>
      
      {!isSold ? (
        <button
          onClick={() => setShowSellForm(true)}
          className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Sell Ticket"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={handleResetTicket}
          disabled={loading}
          className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Reset Ticket"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
      
      {showSellForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-white mb-4">Sell Ticket #{ticketNumber}</h3>
            <form onSubmit={handleSellTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Buyer Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-md"
                  placeholder="Enter buyer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Buyer Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-md"
                  placeholder="Enter buyer email"
                />
              </div>
              
              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowSellForm(false)}
                  className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors"
                >
                  {loading ? 'Processing...' : 'Sell Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 