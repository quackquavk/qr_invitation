import { NextResponse } from 'next/server';
import { getTicketById } from '../../../data/tickets';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { PDFDocument, rgb } from 'pdf-lib';

export async function POST(request) {
  try {
    const { ticketIds, format = 'zip' } = await request.json();
    
    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid ticket IDs provided' },
        { status: 400 }
      );
    }
    
    // Get base URL for QR codes
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || '';
    
    if (format === 'zip') {
      // Create a new ZIP file
      const zip = new JSZip();
      
      // Process each ticket
      await Promise.all(
        ticketIds.map(async (ticketId) => {
          const ticket = await getTicketById(ticketId);
          if (!ticket) return; // Skip if ticket doesn't exist
          
          // Generate QR code for this ticket
          const verifyUrl = `${baseUrl}/verify/ticket/${ticket.id}`;
          const qrBuffer = await QRCode.toBuffer(verifyUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 512,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          });
          
          // Create a filename based on ticket info
          let filename = `ticket-${ticket.number}`;
          if (ticket.sold && ticket.buyerName) {
            // Add buyer name to filename if ticket is sold
            const safeName = ticket.buyerName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
            filename += `-${safeName}`;
          }
          filename += '.png';
          
          // Add file to ZIP
          zip.file(filename, qrBuffer);
        })
      );
      
      // Generate the ZIP file
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      
      // Return the ZIP file
      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="qr-tickets-${new Date().toISOString().split('T')[0]}.zip"`
        }
      });
    } else if (format === 'pdf') {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Calculate how many QR codes per page
      const qrCodesPerPage = 4; // 2x2 grid
      const pageWidth = 600;
      const pageHeight = 800;
      const qrSize = 250;
      
      // Process tickets in batches for PDF pages
      const ticketBatches = [];
      for (let i = 0; i < ticketIds.length; i += qrCodesPerPage) {
        ticketBatches.push(ticketIds.slice(i, i + qrCodesPerPage));
      }
      
      // Create pages and add QR codes
      for (const batchIds of ticketBatches) {
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        
        // Process each ticket in the batch
        let position = 0;
        for (const ticketId of batchIds) {
          const ticket = await getTicketById(ticketId);
          if (!ticket) continue; // Skip if ticket doesn't exist
          
          // Generate QR code for this ticket
          const verifyUrl = `${baseUrl}/verify/ticket/${ticket.id}`;
          const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: qrSize
          });
          
          // Extract base64 data from data URL
          const base64Data = qrDataUrl.split(',')[1];
          const qrImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'));
          
          // Calculate position (2x2 grid)
          const row = Math.floor(position / 2);
          const col = position % 2;
          const x = 50 + col * (qrSize + 50);
          const y = pageHeight - 50 - qrSize - row * (qrSize + 100);
          
          // Draw the QR code
          page.drawImage(qrImage, {
            x,
            y,
            width: qrSize,
            height: qrSize
          });
          
          // Add ticket information
          page.drawText(`Ticket #${ticket.number}`, {
            x: x + qrSize / 2 - 40,
            y: y - 20,
            size: 12,
            color: rgb(0, 0, 0)
          });
          
          if (ticket.sold && ticket.buyerName) {
            page.drawText(`Buyer: ${ticket.buyerName}`, {
              x: x + qrSize / 2 - 40,
              y: y - 40,
              size: 10,
              color: rgb(0.3, 0.3, 0.3)
            });
          }
          
          position++;
        }
      }
      
      // Generate the PDF
      const pdfBytes = await pdfDoc.save();
      
      // Return the PDF
      return new NextResponse(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="qr-tickets-${new Date().toISOString().split('T')[0]}.pdf"`
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Supported formats: zip, pdf' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error generating bulk download:', error);
    return NextResponse.json(
      { error: 'Failed to generate bulk download' },
      { status: 500 }
    );
  }
} 