import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";


const UserSaccoSchema = new Schema({
    user_id: {type: ObjectId,
        ref: 'User',
        required: true
    },
    group_id: { type: ObjectId,
        ref: 'Group',
        required: true
     },
    sacco_id: { type: ObjectId,
        ref: 'Sacco',
        required: true
    },
    role_id: {type: ObjectId,
        ref: 'Role',
        required: true
    },
    approved: { type: Number, default: 0}
},{
    timestamps: true
});

const UserSacco = model("User_Sacco", UserSaccoSchema);
export default UserSacco;