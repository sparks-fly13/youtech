const express = require('express');
const Video = require('../../models/Video');
const userAuth = require('../../Middlewares/user-auth');

const editorUpdateRouter = express.Router();

editorUpdateRouter.put('/updateVideo/:videoId', userAuth, async (req, res) => {
    const { title, description } = req.body;
    const video = await Video.findById(req.params.videoId);

    if (!video) {
        return res.status(404).json({ msg: 'Video not found' });
    }

    if (video.uploadedBy.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    video.title = title;
    video.description = description;

    await video.save();
    res.json({ msg: 'Video updated successfully', video });
});

module.exports = editorUpdateRouter;