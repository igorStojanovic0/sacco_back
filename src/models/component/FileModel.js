const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseApiQuery = require('mongoose-api-query');

const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    mime: {
      type: String
    },
    md5: {
      type: String
    },
    filesize: {
      type: Number
    },
    isPublic: {
      type: Boolean,
      "default": true
    },
    allowedUsers: [{
      uid: String,
      realName: String
    }]
  },
  {
    timestamps: true
  }
);
FileSchema.plugin(mongooseApiQuery);
module.exports = mongoose.model('files', FileSchema);
