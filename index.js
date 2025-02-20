const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');

// Create model objects for movies and users
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb+srv://josefameur:greenstar@sci-flix.lzvzqan.mongodb.net/sci-flix?retryWrites=true&w=majority&appName=Sci-Flix')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Create app for express
const app = express();

// Create accessLogStream to log requests to log.txt file.
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

// Triggers morgan to log request to accessLogStream and terminal
app.use(morgan('combined', {stream: accessLogStream}));
app.use(morgan('common'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS functionality
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:1234', 'https://sci-flix.netlify.app', 'http://localhost:4200', 'https://ambrosia-fish.github.io', 'https://sciflix-angular-client.feztech.io'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// GET request returns list of all movies via JSON 
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

// GET request returns title, year, director, subgenre and description for movieName. 
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req,res) =>{
  await Movies.findOne({Title: req.params.Title})
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    })
});

// GET returns data about genre 
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

// GET requests returns data about director 
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

// GET request returns all users 
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

// GET returns single user
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

//Post request for login
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
  

// POST requests registers new user 
app.post('/users', async (req, res) => {
    try {
      // Check if the password is provided
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

// UPDATE request to update user info 
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

app.post('/users/:username/favorites', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const username = req.params.username;
    const movieId = req.body.movieId;

    console.log('Request details:', {
      username,
      movieIdToToggle: movieId
    });

    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }

    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Current favorites:', user.favoriteMovies);

    // Check if movie is already in favorites
    const isFavorite = user.favoriteMovies.includes(movieId);

    let updatedUser;
    if (isFavorite) {
      // Remove from favorites
      updatedUser = await Users.findOneAndUpdate(
        { username },
        { $pull: { favoriteMovies: movieId } },
        { new: true }
      );
    } else {
      // Add to favorites
      updatedUser = await Users.findOneAndUpdate(
        { username },
        { $push: { favoriteMovies: movieId } },
        { new: true }
      );
    }

    console.log('Updated favorites:', updatedUser.favoriteMovies);
    
    res.json({
      isFavorite: !isFavorite,
      message: isFavorite ? 'Movie removed from favorites' : 'Movie added to favorites',
      favorites: updatedUser.favoriteMovies
    });

  } catch (err) {
    console.error('Favorite toggle error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE request deletes user 
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

// Any unspecified request returns welcome message
app.get('/', (req,res) => {
  res.send('Welcome to Sci-Flix!');
})

// Route any static request to its corresponding file in the public folder
app.use(express.static('public'));

// Create port for request listening
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('It\'s working! It\'s working!')
});