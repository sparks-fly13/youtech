const { google } = require('googleapis');
const Youtuber = require('../models/Youtuber');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

google.options({ auth: oauth2Client });

function getAuthorizationUrl(youtuberId, videoId) {
    const scopes = 'https://www.googleapis.com/auth/youtube.upload';

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',  // Ensures the refresh token is always provided
        state: JSON.stringify({ youtuberId, videoId })
    });

    return authUrl;
}

async function handleOAuthCallback(code, youtuberId) {
    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Save the tokens securely for this particular YouTuber
        const youtuber = await Youtuber.findById(youtuberId);
        if (!youtuber) {
            throw new Error('Youtuber not found');
        }

        youtuber.accessToken = tokens.access_token;
        youtuber.refreshToken = tokens.refresh_token;
        await youtuber.save();

        // Set the credentials for the OAuth2 client
        oauth2Client.setCredentials(tokens);

        return tokens;
    } catch (err) {
        console.error('Error retrieving access and refresh tokens:', err);
        throw new Error('Failed to obtain tokens');
    }
}

module.exports = { getAuthorizationUrl, handleOAuthCallback };