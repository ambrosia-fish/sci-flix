/**
 * JWT Authentication module for the myFlix API.
 * @module jwtAuth
 */

const jwtSecret = 'your_jwt_secret'; // This should be in an environment variable in a real application
const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Import passport configuration

/**
 * Generates a JWT token for a user.
 * @function generateJWTToken
 * @param {Object} user - The user object to be encoded in the JWT.
 * @returns {string} A JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
}

/**
 * Configures the login endpoint for the API.
 * @function
 * @param {Object} router - The Express router object.
 */
module.exports = (router) => {
  /**
   * Login endpoint.
   * @name POST /login
   * @function
   * @memberof module:jwtAuth
   * @inner
   * @param {string} path - Express path
   * @param {callback} middleware - Express middleware.
   */
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}