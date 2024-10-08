const { google } = require('googleapis');
const aws = require('aws-sdk');
// const fs = require('fs');
const Youtuber = require('../models/Youtuber');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

google.options({ auth: oauth2Client });

// Configure AWS
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

async function uploadVideo(youtuberId, filePath, title, description) {
    try {
        const youtuber = await Youtuber.findById(youtuberId);
        if (!youtuber) {
            throw new Error('Youtuber not found');
        }

        oauth2Client.setCredentials({
            access_token: youtuber.accessToken,
            refresh_token: youtuber.refreshToken,
        });

        // Refresh the token if necessary
        const { credentials } = await oauth2Client.refreshAccessToken();
        youtuber.accessToken = credentials.access_token;
        youtuber.refreshToken = credentials.refresh_token || youtuber.refreshToken;
        await youtuber.save();

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filePath.split('/').pop(),  // Get the file name from the path
        };
        const s3Stream = s3.getObject(params).createReadStream();

        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client,
        });

        // Upload the video
        youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: title,
                    description: description,
                    tags: [],  // You can add tags if needed
                    categoryId: '22',  // This is for "People & Blogs", adjust as needed
                },
                status: {
                    privacyStatus: 'private',  // You can set the privacy status as needed
                },
            },
            media: {
                body: s3Stream,  // Read the file stream for upload
            },
        });

        console.log('Video uploaded successfully');
    } catch (err) {
        console.error('Error uploading video:', err);
        throw new Error('Failed to upload video');
    }
}

module.exports = { uploadVideo };
