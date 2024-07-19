const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const ServerDataSchema = new Schema(
  {
    id: { type: String },
    name: { type: String },
    size: { type: Number },
    type: { type: String },
    modified: { type: Date },
    accessed: { type: Date },
    path: { type: String },
    parentId: { type: String }
  },
  modelOption("serverData")
);

model("ServerDataModel", ServerDataSchema);
