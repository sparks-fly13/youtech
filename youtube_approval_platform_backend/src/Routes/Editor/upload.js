const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const Video = require('../../models/Video');
const Youtuber = require('../../models/Youtuber');

const editorUploadRouter = express.Router();

// Configure AWS
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}.mp4`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('File is not a video.'));
    }
  },
  limits: { fileSize: 3 * 1024 * 1024 * 1024 } // 3GB maximum file size
});

editorUploadRouter.post('/upload', userAuth, upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file was uploaded by you.');
  }

  const associatedYoutuberId = await Youtuber.findOne({ name: req.body.associatedYoutuber }).select('_id');

  if (!associatedYoutuberId) {
    return res.status(400).json({ msg: 'No youtuber with that name exists.' });
  }

  const video = new Video({
    title: req.body.title,
    description: req.body.description,
    filePath:`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`, // Use file location from S3
    uploadedBy: req.user.id,
    associatedYoutuber: associatedYoutuberId,
    dateUploaded: Date.now(),
    dateApproved: null
  });

  await video.save();
  res.json({ msg: 'Video uploaded successfully', video });
});

module.exports = editorUploadRouter;
