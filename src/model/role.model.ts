import { model, Schema } from "mongoose";


const RoleSchema = new Schema({
    role_name: { type: String, required: true },
    description: { type: String },
    del_flag: { type: Number, default: 0},
},{
    timestamps: true
});

const Role = model("Role", RoleSchema);
export default Role;
