import { NextResponse } from 'next/server';
import { getInvitation, updateInvitationScanStatus } from '../../../data/invitations';

export async function POST(request, { params }) {
  try {
    const id = params.id;
    
    // Get the invitation
    const invitation = await getInvitation(id);
    
    // If invitation doesn't exist
    if (!invitation) {
      return NextResponse.json(
        { success: false, message: 'Invalid invitation', invitation: null },
        { status: 404 }
      );
    }
    
    // Check if already scanned
    if (invitation.scanned) {
      return NextResponse.json({
        success: false,
        message: 'Invitation already scanned',
        invitation,
        alreadyScanned: true
      });
    }
    
    // Update the scan status
    const updatedInvitation = await updateInvitationScanStatus(id, true);
    
    return NextResponse.json({
      success: true,
      message: 'Invitation verified successfully',
      invitation: updatedInvitation
    });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing invitation' },
      { status: 500 }
    );
  }
} 