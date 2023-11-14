const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  try {
    const token = req.headers.cookie.split('=')[1]// Extract the token from the 'token' cookie

    if (token) {
      jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
        if (err) {
          res.clearCookie('token'); // Clear the token cookie if it's invalid or expired
          res.status(401).json({ error: 'User unauthorized' });
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(401).json({ error: 'User unauthorized' });
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = userAuth;
