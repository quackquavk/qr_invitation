import { NextResponse } from 'next/server';
import { getTicketById } from '../../../../data/tickets';
import QRCode from 'qrcode';

export async function GET(request, { params }) {
  try {
    const paramId= await  params.id;
    const ticket = await getTicketById(paramId);
    
    if (!ticket) {
      return new NextResponse(null, { status: 404 });
    }
    
    // URL for verification
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || '';
    const verifyUrl = `${baseUrl}/verify/ticket/${ticket.id}`;
    
    // Options for QR code to include the ticket number
    const options = {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 512,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      type: 'png'
    };
    
    // Generate QR code as PNG
    const qrBuffer = await QRCode.toBuffer(verifyUrl, options);
    
    // Check if download parameter is set
    const url = new URL(request.url);
    const isDownload = url.searchParams.get('download') === 'true';
    
    // Return QR code as image with appropriate headers
    const headers = {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600'
    };
    
    if (isDownload) {
      const filename = `ticket-${ticket.number}.png`;
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }
    
    return new NextResponse(qrBuffer, { headers });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return new NextResponse(null, { status: 500 });
  }
} 