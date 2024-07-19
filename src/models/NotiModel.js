const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const notiSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: process.env.MODEL_PREFIX + "_users",
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false
    },
    browse: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        timestamps: true
      }
    ],
  },
  modelOption("k_notis")
);

model("Noti", notiSchema);
