const { google } = require('googleapis');
const fs = require('fs');
const Youtuber = require('../models/Youtuber');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI  // This should be your redirect URL
);

google.options({ auth: oauth2Client });

async function uploadVideo(jwtToken, filePath, title, description) {
    try {
        const youtuber = await Youtuber.findOne({ jwtToken });
        if (!youtuber) {
            throw new Error('Youtuber not found');
        }

        if (oauth2Client.isTokenExpiring()) {
            const { tokens } = await oauth2Client.refreshToken(youtuber.refreshToken);
            youtuber.accessToken = tokens.access_token;
            youtuber.refreshToken = tokens.refresh_token;
            await youtuber.save();
        }

        oauth2Client.setCredentials({
            access_token: youtuber.accessToken,
            refresh_token: youtuber.refreshToken
        });

        const youtube = google.youtube({
            version: 'v3',
            auth: youtuber.apiKey
        });

        const response = youtube.videos.insert({
            part: 'id,snippet,status',
            requestBody: {
                snippet: {
                    title: title,
                    description: description,
                    tags: [],  // You can add tags if needed
                    categoryId: '22'  // This is for "People & Blogs", adjust as needed
                },
                status: {
                    privacyStatus: 'private'  // You can set the privacy status as needed
                }
            },
            media: {
                body: fs.createReadStream(filePath)
            }
        });

        return response.data.id;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to upload video');
    }
}

module.exports = { uploadVideo };