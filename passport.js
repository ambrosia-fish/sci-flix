/**
 * Passport configuration for the Sci-Flix Movie API.
 * This module sets up local and JWT authentication strategies.
 * @module passportConfig
 */

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Configure local strategy for username/password authentication.
 * @function
 * @name localStrategy
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    /**
     * Verify callback for local strategy.
     * @async
     * @function
     * @param {string} username - The username provided by the user
     * @param {string} password - The password provided by the user
     * @param {function} callback - Passport callback function
     */
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ username: username })
      .then((user) => {
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, { message: 'Incorrect password.' });
          }
        console.log('finished');
        return callback(null, user);
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);

/**
 * Configure JWT strategy for token-based authentication.
 * @function
 * @name jwtStrategy
 */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, 
/**
 * Verify callback for JWT strategy.
 * @async
 * @function
 * @param {Object} jwtPayload - Decoded JWT payload
 * @param {function} callback - Passport callback function
 */
async (jwtPayload, callback) => {
  return await Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));