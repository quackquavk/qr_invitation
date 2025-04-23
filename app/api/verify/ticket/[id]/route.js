import { NextResponse } from 'next/server';
import { getTicketById, updateTicketScanStatus } from '../../../../data/tickets';

export async function POST(request, { params }) {
  try {
    const id = params.id;
    
    // Get the ticket
    const ticket = await getTicketById(id);
    
    // If ticket doesn't exist
    if (!ticket) {
      return NextResponse.json(
        { success: false, message: 'Invalid ticket', ticket: null },
        { status: 404 }
      );
    }
    
    // // If ticket is not sold
    // if (!ticket.sold) {
    //   return NextResponse.json(
    //     { success: false, message: 'Ticket has not been sold', ticket, isSold: false },
    //     { status: 400 }
    //   );
    // }
    
    // Check if already scanned
    if (ticket.scanned) {
      return NextResponse.json({
        success: false,
        message: 'Ticket already scanned',
        ticket,
        alreadyScanned: true
      });
    }
    
    // Update the scan status
    const updatedTicket = await updateTicketScanStatus(id, true);
    
    return NextResponse.json({
      success: true,
      message: 'Ticket verified successfully',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Error verifying ticket:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing ticket' },
      { status: 500 }
    );
  }
} 