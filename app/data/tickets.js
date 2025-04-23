'use server';

import fs from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'app/data/tickets.json');

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'app/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(dataFilePath)) {
    // Initialize with 200 tickets
    const initialTickets = Array.from({ length: 200 }, (_, index) => ({
      id: uuidv4(),
      number: index + 1,
      sold: false,
      scanned: false,
      scannedAt: null,
      soldAt: null,
      buyerName: null,
      buyerEmail: null,
      createdAt: new Date().toISOString()
    }));
    
    fs.writeFileSync(dataFilePath, JSON.stringify(initialTickets, null, 2));
  }
};

// Get all tickets
export async function getAllTickets() {
  ensureDataDir();
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
}

// Get available (unsold) tickets
export async function getAvailableTickets() {
  const tickets = await getAllTickets();
  return tickets.filter(ticket => !ticket.sold);
}

// Get sold tickets
export async function getSoldTickets() {
  const tickets = await getAllTickets();
  return tickets.filter(ticket => ticket.sold);
}

// Get a single ticket by ID
export async function getTicketById(id) {
  const tickets = await getAllTickets();
  return tickets.find(ticket => ticket.id === id);
}

// Get a single ticket by number
export async function getTicketByNumber(number) {
  const tickets = await getAllTickets();
  return tickets.find(ticket => ticket.number === parseInt(number, 10));
}

// Mark a ticket as sold
export async function markTicketAsSold(id, buyerName, buyerEmail) {
  const tickets = await getAllTickets();
  const ticketIndex = tickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) return null;
  if (tickets[ticketIndex].sold) return null; // Already sold
  
  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    sold: true,
    soldAt: new Date().toISOString(),
    buyerName,
    buyerEmail
  };
  
  fs.writeFileSync(dataFilePath, JSON.stringify(tickets, null, 2));
  return tickets[ticketIndex];
}

// Update a ticket's scan status
export async function updateTicketScanStatus(id, scanned = true) {
  const tickets = await getAllTickets();
  const ticketIndex = tickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) return null;
  
  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    scanned,
    scannedAt: scanned ? new Date().toISOString() : null
  };
  
  fs.writeFileSync(dataFilePath, JSON.stringify(tickets, null, 2));
  return tickets[ticketIndex];
}

// Reset a ticket (mark as unsold)
export async function resetTicket(id) {
  const tickets = await getAllTickets();
  const ticketIndex = tickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) return null;
  
  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    sold: false,
    scanned: false,
    scannedAt: null,
    soldAt: null,
    buyerName: null,
    buyerEmail: null
  };
  
  fs.writeFileSync(dataFilePath, JSON.stringify(tickets, null, 2));
  return tickets[ticketIndex];
}

// Initialize or reset all tickets
export async function initializeTickets() {
  const dataDir = path.join(process.cwd(), 'app/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Initialize with 200 tickets
  const initialTickets = Array.from({ length: 200 }, (_, index) => ({
    id: uuidv4(),
    number: index + 1,
    sold: false,
    scanned: false,
    scannedAt: null,
    soldAt: null,
    buyerName: null,
    buyerEmail: null,
    createdAt: new Date().toISOString()
  }));
  
  fs.writeFileSync(dataFilePath, JSON.stringify(initialTickets, null, 2));
  return initialTickets;
} 