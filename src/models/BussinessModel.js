const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const bussinessSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    parent: { type: Schema.Types.ObjectId, ref: "Bussiness" },
    order: { type: Number },
    path: { type: String },
    name: { type: String },
    theme: { type: String },
    icon: { type: String },
    menu: { type: Boolean, default: false },
    sideBar: { type: Boolean, default: false },
    fullScreen: { type: Boolean, default: false },
    actions: [{ type: String }],
    order: { type: Number, default: 1 },
    del: { type: Boolean, default: false },
  },
  modelOption("business")
);

model("Bussiness", bussinessSchema);

// require('../controllers/admin/GroupManageCtr').initGroups()
