#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate a secure random JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Create .env content
const envContent = `# Environment Variables for Sci-Flix
# Generated on ${new Date().toISOString()}

# MongoDB Connection
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/sci-flix

# JWT Secret 
JWT_SECRET=${jwtSecret}

# Server Configuration
PORT=8080
`;

// Write to .env file
fs.writeFileSync(path.join(__dirname, '.env'), envContent);

console.log('Successfully generated .env file with secure JWT secret');
console.log('IMPORTANT: Update the MONGODB_URI with your actual database credentials');