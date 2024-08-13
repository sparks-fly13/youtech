const express = require('express');
const Youtuber = require('../../models/Youtuber');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const bcrypt = require('bcrypt')
const validateRequest = require('../../Middlewares/validate-request');
const cors = require('cors');

const YoutuberLoginRouter = express.Router();

YoutuberLoginRouter.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}));

YoutuberLoginRouter.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
], validateRequest,
    async (req, res) => {
        const { email, password } = req.body;

        try {
            const existingYoutuber = await Youtuber.findOne({ email });

            if (!existingYoutuber) {
                res.status(400).json({ error: 'The email doesn\'t exist' });
            }

            const isPwdValid = await bcrypt.compare(password, existingYoutuber.password);

            if (!isPwdValid) {
                res.status(400).json({ error: 'password mismatch' });
            }

            if (isPwdValid) {
                jwt.sign({
                    id: existingYoutuber._id,
                    email: existingYoutuber.email,
                    name: existingYoutuber.name,
                    dateRegistered: existingYoutuber.dateRegistered
                }, process.env.JWT_KEY, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, {
                        sameSite: 'lax',
                        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                    }).json(existingYoutuber);
                });
            }

        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
    });

module.exports = YoutuberLoginRouter;