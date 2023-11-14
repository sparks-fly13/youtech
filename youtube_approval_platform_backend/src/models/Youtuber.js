const { Schema, model } = require('mongoose');

const YoutuberSchema = new Schema({
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
    apiKey: {
        type: String,
    },
    dateRegistered: {
        type: Date,
        default: Date.now
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String
    }
});

module.exports = model('Youtuber', YoutuberSchema);
