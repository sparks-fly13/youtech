const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');
const {uploadVideo} = require('../../services/youtubeService');
const {sendEmail} = require('../../services/notificationService');

const youtuberUploadRouter = express.Router();

youtuberUploadRouter.post('/upload/:videoId', userAuth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        const youtuberEmail = req.user.email;
        if (!video) {
            return res.status(404).json({ msg: 'Video not found' });
        }

        if (video.status !== 'approved') {
            return res.status(400).json({ msg: 'Video not approved' });
        }

        await uploadVideo(req.cookies.token, video.filePath, video.title, video.description);
        await sendEmail(youtuberEmail);

        res.json({ msg: 'Video uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = youtuberUploadRouter;