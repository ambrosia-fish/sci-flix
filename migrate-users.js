const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const Models = require('./models.js');

// Create model objects for users
const Users = Models.User;

// Connect to MongoDB using environment variables for credentials
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sci-flix';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1);
  });

// Function to read and migrate users from JSON file
async function migrateUsers() {
  try {
    // Read users.json file
    const rawData = fs.readFileSync(path.join(__dirname, 'users.json'));
    const users = JSON.parse(rawData);
    
    console.log(`Found ${users.length} users to migrate`);
    
    // Process each user
    for (const user of users) {
      // Check if user already exists in database
      const existingUser = await Users.findOne({ username: user.username });
      
      if (existingUser) {
        console.log(`User ${user.username} already exists in database, updating password hash...`);
        
        // Update password with hashed version
        existingUser.password = Users.hashPassword(user.password);
        await existingUser.save();
        
        console.log(`Updated password hash for ${user.username}`);
      } else {
        console.log(`Creating new user ${user.username} with hashed password...`);
        
        // Create new user with hashed password
        await Users.create({
          username: user.username,
          password: Users.hashPassword(user.password),
          email: user.email,
          birthday: user.birthday || null,
          favoriteMovies: []
        });
        
        console.log(`Created new user ${user.username}`);
      }
    }
    
    console.log('Migration completed successfully!');
    
    // Remove plaintext password data
    console.log('Replacing plaintext password file with anonymized version...');
    
    // Create anonymized version of users.json
    const anonymizedUsers = users.map(user => ({
      username: user.username,
      password: '[HASHED]', // Placeholder to indicate passwords are hashed
      email: user.email
    }));
    
    // Write anonymized users to users.json
    fs.writeFileSync(
      path.join(__dirname, 'users.json'), 
      JSON.stringify(anonymizedUsers, null, 2)
    );
    
    console.log('Replaced users.json with anonymized version');
    
    mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during migration:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}

// Run the migration
migrateUsers();