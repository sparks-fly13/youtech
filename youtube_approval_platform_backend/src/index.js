require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
// const googleAuthRouter = require('./Routes/googleAuth');
const feedbackRouter = require('./Routes/feedback');

//importing editor routes
//hello 
const editorSignUpRouter = require('./Routes/Editor/signup');
const editorLoginRouter = require('./Routes/Editor/login');
const editorDeleteRouter = require('./Routes/Editor/delete');
const editorVideosListRouter = require('./Routes/Editor/list-videos');
const editorUploadRouter = require('./Routes/Editor/upload');
const editorUpdateRouter = require('./Routes/Editor/update');

//importing youtuber routes
const youtuberSignUpRouter = require('./Routes/Youtuber/signup');
const youtuberLoginRouter = require('./Routes/Youtuber/login');
const youtuberApproveRouter = require('./Routes/Youtuber/approve');
const youtuberRejectRouter = require('./Routes/Youtuber/reject');
const youtuberUploadRouter = require('./Routes/Youtuber/upload');
const youtuberPendingVideosRouter = require('./Routes/Youtuber/pending-videos');

const profileRouter = require('./Routes/profile');
const logoutRouter = require('./Routes/logout');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

// app.use(googleAuthRouter);
app.use(feedbackRouter);

//using editor routes
app.use("/editor",editorSignUpRouter);
app.use("/editor",editorLoginRouter);
app.use("/editor",editorDeleteRouter);
app.use("/editor",editorVideosListRouter);
app.use("/editor",editorUploadRouter);
app.use("/editor",editorUpdateRouter);

//using youtuber routes
app.use("/youtuber",youtuberSignUpRouter);
app.use("/youtuber",youtuberLoginRouter);
app.use("/youtuber",youtuberApproveRouter);
app.use("/youtuber",youtuberRejectRouter);
app.use("/youtuber",youtuberUploadRouter);
app.use("/youtuber",youtuberPendingVideosRouter);

app.use(profileRouter);
app.use(logoutRouter);

app.all('*', async (req, res) => {
    throw new Error('Route not found');
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(400).json({error: err.message});
});

mongoose.connect('mongodb://127.0.0.1:27017/youTube')
    .then(() => {
        app.listen(3000, () => {
            console.log('Listening on port 3000');
        });
    })
    .catch(err => {
        console.log(err);
    });