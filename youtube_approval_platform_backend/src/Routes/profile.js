const express = require('express');
const userAuth = require('../Middlewares/user-auth');
const cors = require('cors');

const profileRouter = express.Router();

profileRouter.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}));

profileRouter.get('/profile', userAuth, (req, res) => {
    res.status(200).json(req.user);
});

module.exports = profileRouter;