import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInvitation } from '../../data/invitations';
import QRGenerator from '../../components/QRGenerator';

export const dynamic = 'force-dynamic';

export default async function InvitationPage({ params }) {
  const invitation = await getInvitation(params.id);
  
  if (!invitation) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Invitation Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{invitation.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{invitation.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>
                  {invitation.scanned ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Scanned on {new Date(invitation.scannedAt).toLocaleString()}
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Not Scanned
                    </span>
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Created On</p>
                <p className="font-medium">{new Date(invitation.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">QR Invitation Code</h2>
            <QRGenerator invitationId={invitation.id} invitationData={invitation} />
          </div>
        </div>
      </div>
    </div>
  );
}
