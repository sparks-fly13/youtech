const express = require('express');
const userAuth = require('../../Middlewares/user-auth');
const Video = require('../../models/Video');
const fs = require('fs');

const editorDeleteRouter = express.Router();

editorDeleteRouter.delete('/deleteVideo/:videoId', userAuth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }
        if (video.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(401).send('Not authorized');
        }
        fs.unlinkSync(video.filePath);
        await video.remove();
        res.json({ msg: 'Video deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    } 
});

module.exports = editorDeleteRouter;