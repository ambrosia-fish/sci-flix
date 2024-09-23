/**
 * Express server setup for Sci-Flix Movie API.
 * @module movieApiServer
 */

const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');

/**
 * Movie model from MongoDB.
 * @type {mongoose.Model}
 */
const Movies = Models.Movie;

/**
 * User model from MongoDB.
 * @type {mongoose.Model}
 */
const Users = Models.User;

/**
 * Connects to MongoDB database.
 * @function
 * @name connectToDatabase
 */
mongoose.connect('mongodb+srv://josefameur:greenstar@sci-flix.lzvzqan.mongodb.net/sci-flix?retryWrites=true&w=majority&appName=Sci-Flix')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

/**
 * Express application instance.
 * @type {express.Application}
 */
const app = express();

/**
 * Creates a write stream for logging requests.
 * @constant
 * @type {fs.WriteStream}
 */
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

// Middleware setup
app.use(morgan('combined', {stream: accessLogStream}));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * CORS configuration.
 * @constant
 * @type {Object}
 */
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:1234', 'https://sci-flix.netlify.app', 'http://localhost:4200', 'https://ambrosia-fish.github.io'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

/**
 * GET request to fetch all movies.
 * @name GET/movies
 * @function
 * @async
 * @returns {Object[]} Array of movie objects
 */
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * GET request to fetch a specific movie by title.
 * @name GET/movies/:Title
 * @function
 * @async
 * @param {string} Title - The title of the movie
 * @returns {Object} Movie object
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req,res) => {
  await Movies.findOne({Title: req.params.Title})
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    })
});

/**
 * GET request to fetch genre information.
 * @name GET/movies/genre/:genreName
 * @function
 * @async
 * @param {string} genreName - The name of the genre
 * @returns {Object} Genre description
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({'Genre.Name': req.params.genreName})
    .then((movie) => {
      if (!movie) {
        return res.status(404).send("Genre not found");
      }
      res.json({genreDescription: movie.Genre.Description});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET request to fetch director information.
 * @name GET/movies/director/:directorName
 * @function
 * @async
 * @param {string} directorName - The name of the director
 * @returns {Object} Director information
 */
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({'Director.Name': req.params.directorName})
    .then((movie) => {
      if (!movie) {
        return res.status(404).send("Director not found");
      }
      const directorData = {
        Name: movie.Director.Name,
        Bio: movie.Director.Bio,
        Birth: movie.Director.Birth,
        Death: movie.Director.Death
      };
      res.json(directorData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET request to fetch all users.
 * @name GET/users
 * @function
 * @async
 * @returns {Object[]} Array of user objects
 */
app.get('/users', async (req,res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

/**
 * GET request to fetch a single user.
 * @name GET/users/:user
 * @function
 * @async
 * @param {string} user - Username
 * @returns {Object} User object
 */
app.get('/users/:user', async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.params.user });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err.message);
  }
});

/**
 * POST request for user login.
 * @name POST/login
 * @function
 * @async
 * @param {Object} req.body - Login credentials
 * @param {string} req.body.username - Username
 * @param {string} req.body.password - Password
 * @returns {Object} User object and JWT token
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
        
        if (!user.validatePassword(password)) {
          return res.status(400).json({ message: 'Incorrect password' });
        }
        
        const token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Error: ' + error });
      });
  });

/**
 * POST request to register a new user.
 * @name POST/users
 * @function
 * @async
 * @param {Object} req.body - User data
 * @param {string} req.body.username - Username
 * @param {string} req.body.password - Password
 * @param {string} req.body.email - Email address
 * @param {string} req.body.birthday - User's birthday
 * @returns {Object} New user object
 */
app.post('/users', async (req, res) => {
    try {
      if (!req.body.password) {
        return res.status(400).json({ error: 'Password is required' });
      }
  
      let hashedPassword = Users.hashPassword(req.body.password);
  
      const user = await Users.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).json({ error: req.body.username + ' already exists' });
      }
  
      const newUser = await Users.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        birthday: req.body.birthday
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

/**
 * PATCH request to update user information.
 * @name PATCH/users/:username
 * @function
 * @async
 * @param {string} username - Username
 * @param {Object} req.body - Updated user data
 * @returns {Object} Updated user object
 */
app.patch('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $set: {
      username: req.body.username,
      password: Users.hashPassword(req.body.password),
      email: req.body.email,
      birthday: req.body.birthday
    }
  }, { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * POST request to add or remove a movie from user's favorites.
 * @name POST/users/:username/favorites
 * @function
 * @async
 * @param {string} username - Username
 * @param {Object} req.body - Favorite movie data
 * @param {string} req.body.newFavorite - Movie ID to add/remove from favorites
 * @returns {Object} Message indicating success
 */
app.post('/users/:username/favorites', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { username } = req.params;
  const { newFavorite } = req.body;

  try {
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFavorite = user.favoriteMovies.includes(newFavorite);

    if (isFavorite) {
      await Users.findOneAndUpdate({ username }, {
        $pull: { favoriteMovies: newFavorite }
      }, { new: true });
      res.json({ message: 'Movie removed from favorites' });
    } else {
      await Users.findOneAndUpdate({ username }, {
        $push: { favoriteMovies: newFavorite }
      }, { new: true });
      res.json({ message: 'Movie added to favorites' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/**
 * DELETE request to remove a user.
 * @name DELETE/users/:user
 * @function
 * @async
 * @param {string} user - Username
 * @returns {string} Confirmation message
 */
app.delete('/users/:user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({username: req.params.user})
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.user + ' was not found');
      } else {
        res.status(200).send(req.params.user + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

/**
 * Default route handler.
 * @name GET/
 * @function
 * @returns {string} Welcome message
 */
app.get('/', (req,res) => {
  res.send('Welcome to Sci-Flix!');
});

// Serve static files
app.use(express.static('public'));

/**
 * Start the server.
 * @function
 * @name startServer
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('It\'s working! It\'s working!');
});