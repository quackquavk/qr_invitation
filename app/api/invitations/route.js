import { NextResponse } from 'next/server';
import { createInvitation, getInvitations, getInvitation, updateInvitationScanStatus } from '../../data/invitations';

// Create a new invitation
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;
    
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' }, 
        { status: 400 }
      );
    }
    
    const newInvitation = await createInvitation(name, email);
    
    return NextResponse.json(newInvitation, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { message: 'Failed to create invitation' }, 
      { status: 500 }
    );
  }
}

// Get all invitations
export async function GET() {
  try {
    const invitations = await getInvitations();
    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { message: 'Failed to fetch invitations' }, 
      { status: 500 }
    );
  }
} 