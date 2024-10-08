const { google } = require('googleapis');
const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');
const Youtuber = require('../../models/Youtuber');
const { getAuthorizationUrl, handleOAuthCallback } = require('../../services/youtubeAuthService');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

google.options({ auth: oauth2Client });

const youtuberApproveRouter = express.Router();

youtuberApproveRouter.post('/approve/:videoId', userAuth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ msg: 'Video not found' });
        }

        const associatedYoutuber = await Youtuber.findById(video.associatedYoutuber);
        if (!associatedYoutuber) {
            return res.status(404).json({ msg: 'Associated Youtuber not found' });
        }

        if (!associatedYoutuber.accessToken || !associatedYoutuber.refreshToken) {
            const authUrl = getAuthorizationUrl(associatedYoutuber._id, video._id);
            return res.json({ msg: 'Authorization required', authUrl });
        }
        oauth2Client.setCredentials({
            access_token: associatedYoutuber.accessToken,
            refresh_token: associatedYoutuber.refreshToken,
        });

        try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            associatedYoutuber.accessToken = credentials.access_token;
            associatedYoutuber.refreshToken = credentials.refresh_token || associatedYoutuber.refreshToken;
            await associatedYoutuber.save();
        } catch (tokenError) {
            // If refreshing the token fails, redirect to OAuth authorization
            const authUrl = getAuthorizationUrl(associatedYoutuber._id, video._id);
            return res.json({ msg: 'Authorization required', authUrl });
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

youtuberApproveRouter.get('/auth/google/callback', async (req, res) => {
    const { code, state } = req.query;
    const { youtuberId, videoId } = JSON.parse(state); // Assuming state is the youtuberId

    try {
        await handleOAuthCallback(code, youtuberId);

        //redirect to youtuber dashboard on the frontend
        res.redirect(`${process.env.FRONTEND_URL}/youtuber/dashboard`);
    } catch (error) {
        console.error('Error handling OAuth callback:', error);
        res.status(500).send('Failed to handle OAuth callback.');
    }
});

module.exports = youtuberApproveRouter;