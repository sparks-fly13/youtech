const express = require('express');

const logoutRouter = express.Router();

logoutRouter.get('/logout', (req, res) => {
    res.clearCookie('token', {
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Logged out successfully!' });
});

module.exports = logoutRouter;