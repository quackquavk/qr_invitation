'use server';
import fs from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'app/data/invitations.json');

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'app/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

// Get all invitations
export async function getInvitations() {
  ensureDataDir();
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
}

// Get a single invitation by ID
export async function getInvitation(id) {
  const invitations = await getInvitations();
  return invitations.find(invitation => invitation.id === id);
}

// Create a new invitation
export async function createInvitation(name, email) {
  const invitations = await getInvitations();
  const newInvitation = {
    id: uuidv4(),
    name,
    email,
    createdAt: new Date().toISOString(),
    scanned: false,
    scannedAt: null
  };
  
  invitations.push(newInvitation);
  fs.writeFileSync(dataFilePath, JSON.stringify(invitations, null, 2));
  return newInvitation;
}

// Update an invitation's scan status
export async function updateInvitationScanStatus(id, scanned = true) {
  const invitations = await getInvitations();
  const invitationIndex = invitations.findIndex(inv => inv.id === id);
  
  if (invitationIndex === -1) return null;
  
  invitations[invitationIndex] = {
    ...invitations[invitationIndex],
    scanned,
    scannedAt: scanned ? new Date().toISOString() : null
  };
  
  fs.writeFileSync(dataFilePath, JSON.stringify(invitations, null, 2));
  return invitations[invitationIndex];
}

// Delete an invitation
export async function deleteInvitation(id) {
  const invitations = await getInvitations();
  const filteredInvitations = invitations.filter(inv => inv.id !== id);
  fs.writeFileSync(dataFilePath, JSON.stringify(filteredInvitations, null, 2));
} 