const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const roleSchema = new Schema(
  {
    title: { type: String, required: true },
    del: { type: Boolean, default: false },
    type: { type: String, default: "other" },
    permissions: [
      new Schema(
        {
          permission: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Bussiness",
          },
          action: [{ type: String }],
        },
        { _id: false }
      ),
    ],
  },
  modelOption("role")
);

model("Role", roleSchema);

require("../controllers/admin/RoleManageCtr").initRole();
