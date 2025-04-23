import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTicketById } from '../../data/tickets';
import { Download, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TicketPage({ params }) {
  const ticket = await getTicketById(params.id);
  
  if (!ticket) {
    notFound();
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Link 
            href="/tickets"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tickets</span>
          </Link>
        </div>
        
        <div className="bg-zinc-800/40 rounded-xl overflow-hidden border border-zinc-700/50">
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 border-b border-zinc-700/50">
            <h1 className="text-2xl font-bold text-white">
              Ticket #{ticket.number}
            </h1>
            <div className="text-sm text-zinc-400 mt-1">
              ID: {ticket.id}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 bg-white p-4 rounded-lg border border-zinc-700/50">
                  <img 
                    src={`/api/qr/ticket/${ticket.id}`}
                    alt={`QR Code for Ticket #${ticket.number}`}
                    className="w-64 h-64"
                  />
                </div>
                
                <div className="mt-2 text-center text-zinc-400 text-sm">
                  Scan this QR code at the event entrance
                </div>
                
                <a 
                  href={`/api/qr/ticket/${ticket.id}?download=true`}
                  download={`ticket-${ticket.number}.png`}
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Code</span>
                </a>
              </div>
              
              <div className="bg-zinc-800/60 p-6 rounded-lg border border-zinc-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Ticket Details</h2>
                
                <dl className="space-y-4">
                  <div>
                    <dt className="text-zinc-400 text-sm">Status</dt>
                    <dd>
                      {ticket.sold ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
                          Sold
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800">
                          Available
                        </span>
                      )}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-zinc-400 text-sm">Scan Status</dt>
                    <dd>
                      {ticket.scanned ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                          Scanned on {formatDate(ticket.scannedAt)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-400 border border-zinc-700">
                          Not Scanned
                        </span>
                      )}
                    </dd>
                  </div>
                  
                  {ticket.sold && (
                    <>
                      <div>
                        <dt className="text-zinc-400 text-sm">Buyer Name</dt>
                        <dd className="text-white font-medium">{ticket.buyerName}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-zinc-400 text-sm">Buyer Email</dt>
                        <dd className="text-white font-medium">{ticket.buyerEmail}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-zinc-400 text-sm">Sold On</dt>
                        <dd className="text-white">{formatDate(ticket.soldAt)}</dd>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <dt className="text-zinc-400 text-sm">Created On</dt>
                    <dd className="text-white">{formatDate(ticket.createdAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 