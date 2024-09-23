Sci-Flix Movie API

Overview

The Sci-Flix Movie API is a RESTful API built using Express.js and MongoDB. It provides endpoints to manage and interact with a movie database, allowing users to retrieve movie information, manage user accounts, and handle user favorites.

Table of Contents

- Installation
- Usage
- API Endpoints
- Authentication
- Logging
- Technologies Used
- License

Installation

1. Clone the repository:
   git clone https://github.com/yourusername/sci-flix-api.git
   cd sci-flix-api

2. Install dependencies:
   npm install

3. Set up environment variables for your MongoDB connection string and any other necessary configuration.

4. Start the server:
   npm start

Usage

Access the API at http://localhost:8080 (or your specified port).

API Endpoints

Movies

- GET /movies - Fetch all movies
- GET /movies/:Title - Fetch a movie by title
- GET /movies/genre/:genreName - Fetch genre information by genre name
- GET /movies/director/:directorName - Fetch director information by director name

Users

- GET /users - Fetch all users
- GET /users/:user - Fetch a single user by username
- POST /login - User login
- POST /users - Register a new user
- PATCH /users/:username - Update user information
- POST /users/:username/favorites - Add or remove a movie from user's favorites
- DELETE /users/:user - Remove a user

Default

- GET / - Welcome message

Authentication

The API uses JWT for authentication. Some endpoints require a valid token. You can obtain a token by logging in with valid user credentials.

Logging

Request logging is enabled using morgan. Logs are written to log.txt in the project directory.

Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js (for authentication)
- Morgan (for logging)
- CORS (Cross-Origin Resource Sharing)

License

This project is licensed under the MIT License. See the LICENSE file for details.
