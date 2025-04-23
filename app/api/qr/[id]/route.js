import { NextResponse } from 'next/server';
import { getInvitation } from '../../../data/invitations';
import QRCode from 'qrcode';

export async function GET(request, { params }) {
  try {
    // Get invitation data
    const invitation = await getInvitation(params.id);
    
    if (!invitation) {
      return new NextResponse(null, { status: 404 });
    }
    
    // URL for verification
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || '';
    const verifyUrl = `${baseUrl}/verify/${invitation.id}`;
    
    // Generate QR code as PNG
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      type: 'png',
      width: 512
    });
    
    // Check if download parameter is set
    const url = new URL(request.url);
    const isDownload = url.searchParams.get('download') === 'true';
    
    // Return QR code as image with appropriate headers
    const headers = {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600'
    };
    
    if (isDownload) {
      const filename = `invitation-${invitation.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }
    
    return new NextResponse(qrBuffer, { headers });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return new NextResponse(null, { status: 500 });
  }
} 