const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Define the path to your JSON file
const filePath = path.join(__dirname, 'app', 'data', 'tickets.json');

// Read existing data
let existingTickets = [];
if (fs.existsSync(filePath)) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  try {
    existingTickets = JSON.parse(fileContent);
  } catch (e) {
    console.error('Invalid JSON in tickets.json:', e.message);
    process.exit(1);
  }
}

const lastNumber = existingTickets.length
  ? Math.max(...existingTickets.map(t => t.number))
  : 200;

// Generate 150 new tickets
const newTickets = Array.from({ length: 150 }, (_, index) => ({
  id: uuidv4(),
  number: lastNumber + index + 1,
  sold: false,
  scanned: false,
  scannedAt: null,
  soldAt: null,
  buyerName: null,
  buyerEmail: null,
  createdAt: new Date().toISOString()
}));

// Combine and write back
const updatedTickets = [...existingTickets, ...newTickets];

fs.writeFileSync(filePath, JSON.stringify(updatedTickets, null, 2));

