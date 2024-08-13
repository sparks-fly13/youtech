const { Schema, model } = require('mongoose');

const VideoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    filePath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'uploaded'],
        default: 'pending'
    },
    videoYoutubeId: {
        type: String
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Editor',
        required: true
    },
    associatedYoutuber: {
        type: Schema.Types.ObjectId,
        ref: 'Youtuber',
        required: true
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Youtuber'
    },
    dateUploaded: {
        type: Date,
        default: Date.now
    },
    dateApproved: {
        type: Date
    }
});

module.exports = model('Video', VideoSchema);




//We have fields for title, description, filePath, status, uploadedBy, approvedBy, dateUploaded, and dateApproved.

// The filePath field will store the path to the video file on the server. This is essential for managing the video's storage and eventual deletion after uploading to YouTube.

// The status field indicates the current status of the video. It can be 'pending' (waiting for approval), 'approved' (approved for upload to YouTube), or 'rejected' (not approved for upload).

// The uploadedBy field references the Editor model, indicating which editor uploaded the video.

// The approvedBy field references the Youtuber model, indicating which youtuber approved the video (if it has been approved).