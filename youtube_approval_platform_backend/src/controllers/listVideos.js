const express = require('express');
const Video = require('../models/Video');

const router = express.Router();

router.post('/listVideos', express.json(), async (req, res) => {
    try {
        const pipeline = await Video.aggregate(
            [
                {
                    '$lookup': {
                        'from': 'youtubers',
                        'localField': 'associatedYoutuber',
                        'foreignField': '_id',
                        'as': 'result',
                        'pipeline': [
                            {
                                '$project': {
                                    'name': 1
                                }
                            }
                        ]
                    }
                }, {
                    '$unwind': {
                        'path': '$result'
                    }
                }, {
                    '$project': {
                        'videoYoutubeId': 1,
                        'title': 1,
                        'filePath': 1,
                        'status': 1,
                        'editorId': '$uploadedBy',
                        'youtuberId': '$associatedYoutuber',
                        'youtuberName': '$result.name'
                    }
                }
            ]
        );
        if (!pipeline || pipeline.length === 0) {
            return res.status(204).send('No content');
        }
        console.log(pipeline);
        return res.json(pipeline);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

module.exports = router;