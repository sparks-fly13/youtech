const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');

const youtuberApprovedVideosRouter = express.Router();

youtuberApprovedVideosRouter.get('/approved-videos', userAuth, async (req, res) => {
    try {
        const videos = await Video.find({ associatedYoutuber: req.user.id, status: 'approved' });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = youtuberApprovedVideosRouter;