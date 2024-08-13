const express = require('express');
const Youtuber = require('../../models/Youtuber');
const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const validateRequest = require('../../Middlewares/validate-request');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const YoutuberSignupRouter = express.Router();

YoutuberSignupRouter.use(cors(
    {
        origin: 'http://127.0.0.1:5173',
        credentials: true
    }
));

YoutuberSignupRouter.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
], validateRequest,
    async (req, res) => {
        const { email, password, name } = req.body;

        try {
            const existingYoutuber = await Youtuber.findOne({ email });

            if (existingYoutuber) {
                res.status(400).json({ error: 'Email in use' });
            }

            const hashedPwd = await bcrypt.hash(password, 12);

            const newYoutuber = await Youtuber.create({
                email,
                password: hashedPwd,
                name
            });

            jwt.sign({
                id: newYoutuber._id,
                email: newYoutuber.email,
                name: newYoutuber.name
            }, process.env.JWT_KEY, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, {
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                }).json(newYoutuber);
            })

        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
    });

module.exports = YoutuberSignupRouter;