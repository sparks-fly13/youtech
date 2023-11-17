const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');

const youtuberRejectRouter = express.Router();

youtuberRejectRouter.post('/reject/:videoId', userAuth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ msg: 'Video not found' });
        }

        video.status = 'rejected';

        await video.save();

        res.json({ msg: 'Video rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = youtuberRejectRouter;