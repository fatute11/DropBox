const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const FolderSchema = new Schema({

    name: {
        trim: true,
        type: String,
        required: true,
        lowercase: true,
    },
    path: {
        type: String,
        // required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }],
    subFolders: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Folder' 
    }],
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })


module.exports = mongoose.model('Folder', FolderSchema);