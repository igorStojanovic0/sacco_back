import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";


const RoleUserSchema = new Schema({
    user_id: {type: ObjectId,
        ref: 'User'
    },
    role_id: {type: ObjectId,
        ref: 'Role'
    },
},{
    timestamps: true
});

const RoleUser = model("Role_User", RoleUserSchema);
export default RoleUser;