// function.js

const { v4: uuidv4 } = require('uuid');

const initialTickets = Array.from({ length: 150 }, (_, index) => ({
  id: uuidv4(),
  number: index + 201,
  sold: false,
  scanned: false,
  scannedAt: null,
  soldAt: null,
  buyerName: null,
  buyerEmail: null,
  createdAt: new Date().toISOString()
}));

console.log(JSON.stringify(initialTickets, null, 2));
