const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const FileSchema = new Schema({

    title: {
        trim: true,
        type: String,
        required: true,
        lowercase: true,
    },
    mimeType: {
        type: String,
        required: false,
    },
    size: {
        type: String,
        required: true,
    },
    originalPath: {
        type: String,
        //required: true,
    },
    path: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true })


module.exports = mongoose.model('File', FileSchema);