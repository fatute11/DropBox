const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const UserSchema = new Schema({

  username: {
      trim: true,
      type: String,
      required: true,
      lowercase: true,
  },
  email: {
      type: String,
      required: true,
  },
  password: {
      type: String,
      required: true,
  },
  passwordToken: {type: String},
  files:[{
      type: Schema.Types.ObjectId,
      ref: 'File'
  }],
  sharedFiles:[{
      type: Schema.Types.ObjectId,
      ref: 'File'
  }],
  folders:[{
      type: Schema.Types.ObjectId,
      ref: 'Folder'
  }],
  sharedFolders:[{
      type: Schema.Types.ObjectId,
      ref: 'Folder'
  }],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);

// module.exports = mongoose.model('User', UserSchema);
// const User = mongoose.model(
//   "User",
//   new mongoose.Schema({
//     username: String,
//     email: String,
//     password: String,
//     roles: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Role"
//       }
//     ]
//   })
// );

// module.exports = User;