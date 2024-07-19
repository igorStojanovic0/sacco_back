const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const LogSchema = new Schema(
  {
    ip: {
      type: String,
    },
    uid: {
      type: Schema.ObjectId,
      ref: "User",
    },
    url: {
      type: String,
    },
    action: {
      type: String,
    },
    did: {
      type: String, //document id ( for update, delete )
    },
  },
  modelOption("logs")
);

model("Log", LogSchema);
