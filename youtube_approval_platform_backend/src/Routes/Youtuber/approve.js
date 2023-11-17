const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');

const youtuberApproveRouter = express.Router();

youtuberApproveRouter.post('/approve/:videoId', userAuth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ msg: 'Video not found' });
        }

        video.status = 'approved';
        video.approvedBy = req.user.id;
        video.dateApproved = Date.now();

        await video.save();

        res.json({ msg: 'Video approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = youtuberApproveRouter;