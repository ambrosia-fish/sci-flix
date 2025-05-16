# Sci-Flix Movie API

A RESTful API built with Express.js and MongoDB that provides endpoints for managing and interacting with a science fiction movie database.

## Overview

The Sci-Flix Movie API is the backend service that powers the Sci-Flix movie platform. It provides a comprehensive set of endpoints to access movie information, manage user accounts, handle authentication, and support user interactions like favorites management. Built with modern Node.js practices, this API serves as the data layer for both the [React](https://github.com/ambrosia-fish/sci-flix-client) and [Angular](https://github.com/ambrosia-fish/sciflix-angular-client) frontend applications.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Authentication](#authentication)
- [Logging & Error Handling](#logging--error-handling)
- [Technologies Used](#technologies-used)
- [Security](#security)
- [Deployment](#deployment)
- [License](#license)

## Features

- **Comprehensive Movie Database**: Store and retrieve detailed movie information
- **User Management**: Handle user registration, authentication, and profile updates
- **Favorites System**: Allow users to manage their favorite movies
- **JWT Authentication**: Secure API access with JSON Web Tokens
- **Detailed Documentation**: Clear documentation for all API endpoints
- **Error Handling**: Robust error handling and informative responses
- **Logging**: Request logging for debugging and monitoring
- **CORS Support**: Cross-Origin Resource Sharing for frontend integration

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ambrosia-fish/sci-flix.git
   cd sci-flix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the project root
   - Add the following variables:
     ```
     PORT=8080
     CONNECTION_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200
     ```

4. Start the server:
   ```bash
   npm start
   ```
   
For development with auto-reloading:
   ```bash
   npx nodemon index.js
   ```

## API Endpoints

### Movies

- `GET /movies` - Fetch all movies
- `GET /movies/:Title` - Fetch a movie by title
- `GET /movies/genre/:genreName` - Fetch genre information by genre name
- `GET /movies/director/:directorName` - Fetch director information by director name

### Users

- `GET /users` - Fetch all users (requires admin authentication)
- `GET /users/:Username` - Fetch a single user by username
- `POST /users` - Register a new user
  ```json
  {
    "Username": "newuser",
    "Password": "password123",
    "Email": "user@example.com",
    "Birthday": "1990-01-01"
  }
  ```
- `PUT /users/:Username` - Update user information
- `POST /users/:Username/movies/:MovieID` - Add a movie to user's favorites
- `DELETE /users/:Username/movies/:MovieID` - Remove a movie from user's favorites
- `DELETE /users/:Username` - Delete a user account

### Authentication

- `POST /login` - User login to get JWT token
  ```json
  {
    "Username": "existinguser",
    "Password": "password123"
  }
  ```

### Default

- `GET /` - Welcome message and API status

## Database Structure

### Movie Schema

```javascript
{
  Title: String,
  Description: String,
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Date,
    Death: Date
  },
  ImagePath: String,
  Featured: Boolean,
  ReleaseYear: Number,
  Actors: [String]
}
```

### User Schema

```javascript
{
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Users log in with valid credentials
2. Server issues a JWT token
3. Clients include the token in the Authorization header for protected routes
4. Token expiration is set to 7 days

Protected routes require a valid bearer token:
```
Authorization: Bearer <your_jwt_token>
```

## Logging & Error Handling

- Request logging is enabled using Morgan, with logs written to `log.txt`
- The API implements comprehensive error handling with appropriate HTTP status codes
- Validation errors provide clear and actionable feedback

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Passport.js**: Authentication middleware
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **CORS**: Cross-Origin Resource Sharing
- **Morgan**: HTTP request logger

## Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- CORS configuration to restrict access
- Input validation and sanitization
- Environment variables for sensitive configuration

## Deployment

The API can be deployed to any Node.js hosting service:

1. Set up the required environment variables
2. Install dependencies with `npm install --production`
3. Start the server with `npm start`

Recommended hosting options:
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- DigitalOcean App Platform

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Related Projects

- [Sci-Flix React Client](https://github.com/ambrosia-fish/sci-flix-client)
- [Sci-Flix Angular Client](https://github.com/ambrosia-fish/sciflix-angular-client)
