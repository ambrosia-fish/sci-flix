// Load environment variables if dotenv isn't loaded via -r flag
if (!process.env.JWT_SECRET) {
  try {
    require('dotenv').config();
  } catch (error) {
    console.warn('dotenv not found, environment variables must be set manually');
  }
}

// Load environment variables or use defaults securely
const jwtSecret = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex');

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');


// generate jwt token
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
}


// post request for logging in
module.exports = (router) => {
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