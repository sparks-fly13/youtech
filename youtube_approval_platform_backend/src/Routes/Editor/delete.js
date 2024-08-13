const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');
const aws = require('aws-sdk');

const editorDeleteRouter = express.Router();

// Configure AWS
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

editorDeleteRouter.delete('/deleteVideo/:videoId', userAuth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.uploadedBy.toString() !== req.user.id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Delete the video file from S3
    const key = video.filePath.split('.com/')[1];
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();

    // Delete the video object from the database
    await video.deleteOne();

    res.json({ msg: 'Video deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = editorDeleteRouter;
