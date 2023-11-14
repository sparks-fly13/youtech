const express = require('express');

const logoutRouter = express.Router();

logoutRouter.get('/logout', (req, res) => {
    res.clearCookie('token', {
        sameSite: 'none',
        secure: true
    });
    res.status(200).json({message: 'Logged out successfully!'});
});

module.exports = logoutRouter;