const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');

const editorVideosListRouter = express.Router();

editorVideosListRouter.get('/listVideos', userAuth, async (req, res) => {
    try {
        const videos = await Video.find({ uploadedBy: req.user.id });   
        res.json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = editorVideosListRouter;