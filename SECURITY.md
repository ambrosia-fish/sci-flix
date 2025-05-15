# Security Improvements for Sci-Flix

This document outlines security improvements made to the Sci-Flix application.

## Password Security

- Passwords are now stored using bcrypt hashing algorithm (not plaintext)
- The `users.json` file has been updated to remove plaintext passwords
- All database operations now use properly hashed passwords
- Existing users' passwords have been migrated to hashed versions

## Environment Variables

- Sensitive credentials (database connection strings, JWT secrets) moved to environment variables
- Added dotenv support for local development
- Created example .env file (.env.example) to guide setup without exposing real credentials
- Added script to generate secure JWT secret (generate-env.js)

## JWT Security

- JWT secret is now generated securely using crypto random bytes
- JWT secret is stored as an environment variable, not in code
- JWT implementation has been secured

## Database Connection

- MongoDB connection string moved to environment variable
- Removed hardcoded database credentials from code

## Getting Started

To set up the application securely:

1. Run `npm install` to install dependencies including dotenv
2. Run `npm run generate-env` to create a secure .env file
3. Edit the .env file and update the MongoDB connection string with your credentials
4. Run `npm run migrate-users` to ensure all user passwords are properly hashed
5. Run `npm start` to start the application with the secure configuration

## Migration

If you have existing users with plaintext passwords:

1. Make sure your MongoDB instance is running
2. Ensure your .env file has the correct MongoDB connection string
3. Run `npm run migrate-users` to hash all user passwords
4. The script will:
   - Read user data from users.json
   - Hash all passwords
   - Update existing users in the database
   - Create users if they don't exist
   - Replace the users.json file with an anonymized version