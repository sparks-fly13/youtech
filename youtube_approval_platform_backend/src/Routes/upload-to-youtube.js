const express = require('express');
const userAuth = require('../Middlewares/user-auth');
const Video = require('../models/Video');
const Youtuber = require('../models/Youtuber');
const { uploadVideo } = require('../services/youtubeService');
const { getAuthorizationUrl, handleOAuthCallback } = require('../services/youtubeAuthService');
const { sendEmail } = require('../services/notificationService');

const uploadToYoutubeRouter = express.Router();

uploadToYoutubeRouter.post('/upload/:videoId', userAuth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ msg: 'Video not found' });
        }
        if (video.status !== 'approved') {
            return res.status(400).json({ msg: 'Video not approved' });
        }
        const associatedYoutuber = await Youtuber.findById(video.associatedYoutuber);
        if (!associatedYoutuber) {
            return res.status(404).json({ msg: 'Associated Youtuber not found' });
        }
        const youtuberEmail = associatedYoutuber.email;
        const youtuberId = associatedYoutuber._id;

        if (!associatedYoutuber.accessToken || !associatedYoutuber.refreshToken) {
            // Redirect to authorization URL if tokens are missing
            const authUrl = getAuthorizationUrl(youtuberId, video._id);
            return res.redirect(authUrl);
            // return res.json({ msg: 'Authorization required', authUrl });
        }

        try {
            const videoId = await uploadVideo(youtuberId, video.filePath, video.title, video.description);
            if (!videoId) {
                return res.status(500).json({ msg: 'Failed to upload the video to youtube' });
            }
            video.status = 'uploaded';
            video.videoYoutubeId = videoId;
            await video.save();

            await sendEmail(youtuberEmail);
            res.json({ msg: 'Video uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Failed to upload video', authUrl: getAuthorizationUrl() });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

uploadToYoutubeRouter.get('/auth/google/callback', async (req, res) => {
    const { code, state } = req.query;

    try {
        const { youtuberId, videoId } = JSON.parse(state);

        // Step 1: Handle the OAuth callback to get and save tokens
        await handleOAuthCallback(code, youtuberId);

        // Step 2: Fetch the video details
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).send('Video not found after OAuth callback.');
        }
        if (video.status !== 'approved') {
            return res.status(400).send('Video not approved for upload.');
        }

        // Step 3: Proceed to upload the video
        try {
            await uploadVideo(youtuberId, video.filePath, video.title, video.description);
            if (!uploadedVideoData) {
                return res.status(500).send('Failed to upload the video to YouTube after OAuth.');
            }
            video.status = 'uploaded';
            video.videoYoutubeId = video._id;
            await video.save();

            // Optionally, send an email notification
            const associatedYoutuber = await Youtuber.findById(youtuberId);
            if (associatedYoutuber) {
                await sendEmail(associatedYoutuber.email);
            }

            // Redirect back to the profile page with a success message
            res.redirect('/profile?upload=success');
        } catch (uploadError) {
            console.error('Error during video upload after OAuth:', uploadError);
            res.status(500).send('Failed to upload video to YouTube after OAuth.');
        }
    } catch (error) {
        console.error('Error handling OAuth callback:', error);
        res.status(500).send('Failed to handle OAuth callback.');
    }
});




module.exports = uploadToYoutubeRouter;