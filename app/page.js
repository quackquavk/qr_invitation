import Link from 'next/link';
import { getInvitations } from './data/invitations';
import { Eye, QrCode } from 'lucide-react';
import InvitationForm from './components/InvitationForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const invitations = await getInvitations();

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-white via-amber-200 to-amber-400 text-transparent bg-clip-text">
          QR Invitation System
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Invitation</h2>
            <InvitationForm />
          </div>
          
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,215,0,0.15)]">
            <div className="bg-gradient-to-r from-zinc-900/80 to-black/80 p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Manage Invitations</h2>
              <p className="text-zinc-400 mt-1">View and track your guest invitations</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <Link 
                  href="/scan"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium px-4 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5" />
                    <span>Scan QR Code</span>
                  </span>
                </Link>
              </div>
              
              {invitations.length === 0 ? (
                <div className="text-zinc-400 text-center py-8 border border-dashed border-zinc-700 rounded-xl">
                  <p>No invitations created yet.</p>
                  <p className="text-sm text-zinc-500 mt-1">Create your first invitation to get started</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {invitations.map((invitation) => (
                        <tr key={invitation.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 text-sm text-white">{invitation.name}</td>
                          <td className="px-4 py-3 text-sm">
                            {invitation.scanned ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
                                Scanned
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800">
                                Not Scanned
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Link 
                              href={`/invitation/${invitation.id}`}
                              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
