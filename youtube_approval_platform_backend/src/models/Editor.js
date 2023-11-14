const { Schema, model } = require('mongoose');

const EditorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    associatedYoutubers: [{
        type: Schema.Types.ObjectId,
        ref: 'Youtuber'
    }],
    dateRegistered: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Editor', EditorSchema);
