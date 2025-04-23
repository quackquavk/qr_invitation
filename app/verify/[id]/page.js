import Link from 'next/link';
import { getInvitation } from '../../data/invitations';

export const dynamic = 'force-dynamic';

export default async function VerifyPage({ params }) {
  let verificationStatus = null;
  let error = null;
  
  try {
    const invitation = await getInvitation(params.id);
    
    if (!invitation) {
      verificationStatus = {
        success: false,
        message: 'This invitation is not valid or has been revoked.'
      };
    } else {
      verificationStatus = {
        success: true,
        message: invitation.scanned 
          ? `This invitation has already been scanned on ${new Date(invitation.scannedAt).toLocaleString()}.`
          : 'Valid invitation. Please present this to the staff at the event.',
        invitation
      };
    }
  } catch (err) {
    console.error('Verification error:', err);
    error = err.message || 'Failed to verify invitation';
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Invitation Verification</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {verificationStatus && (
          <div className={`mb-6 p-6 rounded-md ${verificationStatus.success ? 'bg-green-50' : 'bg-red-50'} border ${verificationStatus.success ? 'border-green-200' : 'border-red-200'}`}>
            <div className="flex flex-col items-center mb-4">
              <div className={`w-16 h-16 rounded-full ${verificationStatus.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mb-4`}>
                {verificationStatus.success ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <div className="text-xl font-bold text-center">
                {verificationStatus.success ? 'Valid Invitation' : 'Invalid Invitation'}
              </div>
              
              <p className={`text-center mt-2 ${verificationStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                {verificationStatus.message}
              </p>
            </div>
            
            {verificationStatus.invitation && (
              <div className="bg-white p-4 rounded-md border mt-4">
                <h3 className="font-semibold mb-2 text-gray-700">Invitation Details:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{verificationStatus.invitation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{verificationStatus.invitation.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(verificationStatus.invitation.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {verificationStatus.invitation.scanned ? (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Scanned
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Not Scanned
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-6">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 