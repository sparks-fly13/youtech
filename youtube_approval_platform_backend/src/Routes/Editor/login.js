const express = require('express');
const Editor = require('../../models/Editor');
const jwt = require('jsonwebtoken');
const {body} = require('express-validator');
const bcrypt = require('bcrypt')
const validateRequest = require('../../Middlewares/validate-request');
const cors = require('cors');

const editorLoginRouter = express.Router();

editorLoginRouter.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}));

editorLoginRouter.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
], validateRequest,
async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingEditor = await Editor.findOne({email});

        if (!existingEditor) {
            res.status(400).json({error: 'The email doesn\'t exist'});
        }

        const isPwdValid = await bcrypt.compare(password, existingEditor.password);

        if (!isPwdValid) {
            res.status(400).json({error: 'password mismatch'});
        }

        if(isPwdValid) {
        jwt.sign({
            id: existingEditor._id,
            email: existingEditor.email,
            name: existingEditor.name,
            associatedYoutubers: existingEditor.associatedYoutubers,
            dateRegistered: existingEditor.dateRegistered
        }, process.env.JWT_KEY, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token, {
                sameSite: 'none',
                secure: true
            }).json(existingEditor);
        });
    }

    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
});

module.exports = editorLoginRouter;