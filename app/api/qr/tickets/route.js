import { NextResponse } from 'next/server';
import { addTickets } from '../../../data/tickets';

export async function POST(request) {
  try {
    const { numTickets } = await request.json();
    
    if (!numTickets || typeof numTickets !== 'number' || numTickets <= 0) {
      return NextResponse.json(
        { error: 'Number of tickets must be a positive integer' },
        { status: 400 }
      );
    }
    
    const newTickets = await addTickets(numTickets);
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully added ${newTickets.length} tickets`,
      tickets: newTickets
    });
  } catch (error) {
    console.error('Error adding tickets:', error);
    return NextResponse.json(
      { error: 'Failed to add tickets', details: error.message },
      { status: 500 }
    );
  }
} 