//import express, morgan, fs, path, mongoose and models.js
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');


// create model objects for movies and users
const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://127.0.0.1:27017/sci-flix', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Could not connect to MongoDB...', err));

mongoose.connect('mongodb+srv://josefameur:greenstar@sci-flix.lzvzqan.mongodb.net/sci-flix?retryWrites=true&w=majority&appName=Sci-Flix')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));


//create app for express
const app = express();

//create accessLogStream to log requests to log.txt file.
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags: 'a'});

//triggers morgan to log request to accessLogStream and terminal
app.use(morgan('combined', {stream: accessLogStream}));
app.use(morgan('common'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors functionality

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://sci-flix.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


//get request returns list of all movies via JSON 
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

//get request returns title, yaer, director, subgenre and description for movieName. 
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


// get returns data about genre 
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


// get requests returns data about director 
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


// get request returns all users 
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

// get returns single user
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

//post requests registers new user 
app.post('/users/', async (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.password);

    try {
        const user = await Users.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).send(req.body.username + ' already exists');
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
        res.status(500).send('Error: ' + error);
    }
});


//update request to update user info 
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
    const { username } = req.params;
    const { newFavorite } = req.body;

    try {
        const user = await Users.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isFavorite = user.favoriteMovies.includes(newFavorite);

        if (isFavorite) {
            // If movie is already a favorite, remove it
            await Users.findOneAndUpdate({ username }, {
                $pull: { favoriteMovies: newFavorite }
            }, { new: true });
            res.json({ message: 'Movie removed from favorites' });
        } else {
            // If movie is not a favorite, add it
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


// //add a favorite 
// app.post('/users/:username/favorites', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     await Users.findOneAndUpdate({ username: req.params.username }, {
//         $push: { 
//             favoriteMovies: req.body.newFavorite 
//         }
//     }, { new: true })
//         .then((updatedUser) => {
//             res.json(updatedUser);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Error: ' + err);
//         });
// });

// //remove a favorite 
// app.delete('/users/:username/favorites', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     await Users.findOneAndUpdate({ username: req.params.username }, {
//         $pull: { 
//             favoriteMovies: req.body.newFavorite 
//         }
//     }, { new: true })
//         .then((updatedUser) => {
//             res.json(updatedUser);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Error: ' + err);
//         });
// });


//delete request deletes user 
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


// //get request returns top 10 json array
// app.get('/TopTen', (req,res) => {
//     res.json(topTenmovies);
// });

//any unspecified request returns welcome message
app.get('/', (req,res) => {
    res.send('Welcome to Sci-Flix!');
})

//route any static request to it's corresponding file in the public folder
app.use(express.static('public'));


//create port for request listening
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('It\'s working! It\'s working!')
});