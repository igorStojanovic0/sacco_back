const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const planSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      ref: process.env.MODEL_PREFIX + "_users",
      required: true
    },
    expireDate: {
      type: String,
      require: true,
    },
    plan: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    result: String,
    note: String,
    done:  {
      type: Boolean,
      default: false,
    },

    doneAt: String,
  },

  modelOption("plans")
);

model("Plan", planSchema);
