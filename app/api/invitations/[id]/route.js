import { NextResponse } from 'next/server';
import { getInvitation, updateInvitationScanStatus, deleteInvitation } from '../../../data/invitations';

// Get a specific invitation
export async function GET(request, { params }) {
  try {
    const invitation = await getInvitation(params.id);
    
    if (!invitation) {
      return NextResponse.json(
        { message: 'Invitation not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { message: 'Failed to fetch invitation' }, 
      { status: 500 }
    );
  }
}

// Update invitation scan status
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const { scanned } = body;
    
    if (scanned === undefined) {
      return NextResponse.json(
        { message: 'Scan status is required' }, 
        { status: 400 }
      );
    }
    
    const updatedInvitation = await updateInvitationScanStatus(params.id, scanned);
    
    if (!updatedInvitation) {
      return NextResponse.json(
        { message: 'Invitation not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error('Error updating invitation scan status:', error);
    return NextResponse.json(
      { message: 'Failed to update invitation' }, 
      { status: 500 }
    );
  }
}

// Delete an invitation
export async function DELETE(request, { params }) {
  try {
    const invitation = await getInvitation(params.id);
    
    if (!invitation) {
      return NextResponse.json(
        { message: 'Invitation not found' }, 
        { status: 404 }
      );
    }
    
    await deleteInvitation(params.id);
    
    return NextResponse.json(
      { message: 'Invitation deleted successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json(
      { message: 'Failed to delete invitation' }, 
      { status: 500 }
    );
  }
} 