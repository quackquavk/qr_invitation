import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTicketById } from '../../../data/tickets';
import TicketVerificationResult from '../../../components/TicketVerificationResult';

export const dynamic = 'force-dynamic';

export default async function TicketVerificationPage({ params }) {
  let verificationStatus = null;
  let error = null;
  
  try {
    const ticket = await getTicketById(params.id);
    
    if (!ticket) {
      verificationStatus = {
        success: false,
        message: 'This ticket is not valid or has been revoked.',
        status: 'invalid'
      };
    } else if (!ticket.sold) {
      verificationStatus = {
        success: false,
        message: 'This ticket has not been sold yet.',
        status: 'not-sold',
        ticket
      };
    } else if (ticket.scanned) {
      verificationStatus = {
        success: false,
        message: `This ticket has already been scanned on ${new Date(ticket.scannedAt).toLocaleString()}.`,
        status: 'already-scanned',
        ticket
      };
    } else {
      verificationStatus = {
        success: true,
        message: 'Valid ticket. Please present this to the staff at the event.',
        status: 'valid',
        ticket
      };
    }
  } catch (err) {
    console.error('Verification error:', err);
    error = err.message || 'Failed to verify ticket';
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Ticket Verification</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {verificationStatus && (
          <TicketVerificationResult status={verificationStatus} />
        )}
        
        <div className="text-center mt-6">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 