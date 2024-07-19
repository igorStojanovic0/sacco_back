const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

//= ===============================
// Individual Chat Content Schema
//= ===============================
const ChatIndiContentSchema = new Schema(
  {
    msgType: {
      type: String, // NORMAL, FILE, EDITED, DELETED, USER_ADDED, USER_LEAVE, USER_REMOVED,
      required: true,
      default: "NORMAL",
    },
    senderId: {
      type: String, // Schema.Types.ObjectId
      required: true,
    },
    senderAvatar: {
      type: String,
      default: 'user'
    },
    recieverId: {
      type: String, // Schema.Types.ObjectId
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    file: {
      // file only
      id: String,
      name: String,
      mime: String,
      md5: String,
      filesize: Number,
      downloaded: [
        {
          userId: String,
          createdAt: String,
        },
      ],
    },
    created: {
      type: Date,
      default: Date.now,
      required: true,
    },
    // messageTotalCount: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
  },
  // modelOption("c_ChatindiContent")
  { collection: "edu_c_ChatindiContent" }
);

model("ChatIndiContent", ChatIndiContentSchema);

module.exports = mongoose.model("ChatIndiContent", ChatIndiContentSchema);
