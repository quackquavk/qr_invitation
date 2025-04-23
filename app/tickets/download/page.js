import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllTickets, getAvailableTickets, getSoldTickets } from '../../data/tickets';
import BulkDownloadOptions from '../../components/BulkDownloadOptions';

export const dynamic = 'force-dynamic';

export default async function TicketDownloadPage() {
  const allTickets = await getAllTickets();
  const availableTickets = await getAvailableTickets();
  const soldTickets = await getSoldTickets();
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link 
            href="/tickets"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tickets</span>
          </Link>
          
          <h1 className="text-3xl font-bold mt-4 mb-8 text-white">Bulk Download QR Codes</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-800/40 p-6 rounded-lg border border-zinc-700/50">
            <h2 className="text-xl font-semibold text-white mb-2">All Tickets</h2>
            <p className="text-zinc-400 mb-4">{allTickets.length} tickets available for download</p>
            <BulkDownloadOptions tickets={allTickets} type="all" />
          </div>
          
          <div className="bg-zinc-800/40 p-6 rounded-lg border border-zinc-700/50">
            <h2 className="text-xl font-semibold text-white mb-2">Available Tickets</h2>
            <p className="text-zinc-400 mb-4">{availableTickets.length} unsold tickets available</p>
            <BulkDownloadOptions tickets={availableTickets} type="available" />
          </div>
          
          <div className="bg-zinc-800/40 p-6 rounded-lg border border-zinc-700/50">
            <h2 className="text-xl font-semibold text-white mb-2">Sold Tickets</h2>
            <p className="text-zinc-400 mb-4">{soldTickets.length} sold tickets available</p>
            <BulkDownloadOptions tickets={soldTickets} type="sold" />
          </div>
        </div>
        
        <div className="bg-zinc-800/40 p-6 rounded-lg border border-zinc-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Download Instructions</h2>
          
          <div className="text-zinc-300 space-y-4">
            <p>
              When you click the download button, a ZIP file containing all the selected QR codes will be prepared.
              Each QR code will be named according to its ticket number for easy identification.
            </p>
            
            <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-700/50">
              <h3 className="font-semibold text-white text-lg mb-2">Note:</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                <li>For large numbers of tickets, the download preparation may take a moment.</li>
                <li>All QR codes are generated with a high error correction level for reliable scanning.</li>
                <li>Each QR code contains a unique identifier that can only be scanned once.</li>
                <li>Sold tickets will show the name of the buyer in the QR code file name.</li>
              </ul>
            </div>
            
            <p>
              For individual ticket downloads, you can visit each ticket&apos;s detail page or use the download icon in the tickets table.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 