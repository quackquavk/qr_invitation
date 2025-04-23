import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getInvitation } from '../../data/invitations';

export const dynamic = 'force-dynamic';

export default async function ShareInvitationPage({ params }) {
  const invitation = await getInvitation(params.id);
  
  if (!invitation) {
    notFound();
  }
  
  return (
    <div className="container min-h-screen mx-auto flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white text-center">
          <h1 className="text-xl font-bold">You&apos;re Invited!</h1>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <div className="mb-4 text-center">
            <p className="text-lg font-semibold mb-1">
              Hello, {invitation.name}!
            </p>
            <p className="text-gray-600">
              Here&apos;s your personal invitation QR code
            </p>
          </div>
          
          <div className="mb-6 p-2 border-2 border-gray-200 rounded-lg bg-white">
            {/* QR Code Server Component */}
            <Image 
              src={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/qr/${invitation.id}`}
              alt="Invitation QR Code"
              width={256}
              height={256}
              className="w-64 h-64"
            />
          </div>
          
          <div className="text-sm text-gray-500 mb-6 text-center">
            <p>Scan this QR code at the event entrance</p>
            <p>Created on: {new Date(invitation.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div className="flex flex-col w-full gap-2">
            <a 
              href={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/qr/${invitation.id}?download=true`}
              download={`invitation-${invitation.name.replace(/\s+/g, '-').toLowerCase()}.png`}
              className="bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR Code
            </a>
            
            <Link 
              href={`/invitation/${invitation.id}`}
              className="bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
            >
              View Full Invitation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 