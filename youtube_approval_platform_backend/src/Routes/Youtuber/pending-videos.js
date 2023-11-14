const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');

const youtuberPendingVideosRouter = express.Router();

youtuberPendingVideosRouter.get('/pending-videos', userAuth, async (req, res) => {
    try {
        const videos = await Video.find({ status: 'pending' });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = youtuberPendingVideosRouter;