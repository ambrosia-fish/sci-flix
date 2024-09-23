/**
 * Mongoose schemas for the Sci-Flix Movie API.
 * @module movieSchemas
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Schema for movie documents.
 * @typedef {Object} MovieSchema
 * @property {string} Title - The title of the movie
 * @property {string} Description - A brief description of the movie
 * @property {Object} Genre - The genre of the movie
 * @property {string} Genre.Name - The name of the genre
 * @property {string} Genre.Description - A description of the genre
 * @property {Object} Director - Information about the movie's director
 * @property {string} Director.Name - The name of the director
 * @property {string} Director.Bio - A brief biography of the director
 * @property {Date} Director.Birth - The birth date of the director
 * @property {Date} Director.Death - The death date of the director (if applicable)
 * @property {string[]} Actors - An array of actor names
 * @property {string} Poster - URL or path to the movie poster image
 * @property {boolean} Featured - Whether the movie is featured or not
 */
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: Date,
        Death: Date,
    },
    Actors: [String],
    Poster: String,
    Featured: Boolean
});

/**
 * Schema for user documents.
 * @typedef {Object} UserSchema
 * @property {string} username - The user's username
 * @property {string} password - The user's hashed password
 * @property {string} email - The user's email address
 * @property {Date} birthday - The user's birthday
 * @property {mongoose.Schema.Types.ObjectId[]} favoriteMovies - Array of references to favorite movies
 */
let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hash a password using bcrypt.
 * @function
 * @name hashPassword
 * @param {string} password - The plain text password to hash
 * @returns {string} The hashed password
 */
userSchema.statics.hashPassword = function(password) {
    return bcrypt.hashSync(password, 10);
};

/**
 * Validate a password against the hashed password stored in the user document.
 * @function
 * @name validatePassword
 * @param {string} password - The plain text password to validate
 * @returns {boolean} True if the password is valid, false otherwise
 */
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Mongoose model for Movie documents.
 * @type {mongoose.Model}
 */
let Movie = mongoose.model('Movie', movieSchema);

/**
 * Mongoose model for User documents.
 * @type {mongoose.Model}
 */
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;