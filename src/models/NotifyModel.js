const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");
// const mongoose = require("mongoose");
// const config = require("../../config");

const notificationSchema = new Schema({
    reporter_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reporter_realName: {
        type: String,
    },
    title: {
      type: String,
      required: [true, "Must be provided list title"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Must be provided list content"],
    },
    files: [{
      type: Schema.Types.ObjectId,
      ref: 'File',
    }],
    receivers: [{
      user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      delflag: {
        type: Boolean,
        default: false
      },
      checked: {
        type: Boolean,
        default: false
      }
    }],
    delflag: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true
  },
  modelOption('notis')
);

model("Notification", notificationSchema);