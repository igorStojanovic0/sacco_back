import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";


const UserGroupChannelSchema = new Schema({
    user_id: {type: ObjectId,
        ref: 'User',
        required: true
    },
    group_id: { type: ObjectId,
        ref: 'Group',
        required: true
    },
    channel_id: { type: ObjectId,
        ref: 'Channel',
        required: true
    },
    role_id: {type: ObjectId,
        ref: 'Role',
        required: true
    },

},{
    timestamps: true
});

const UserGroupChannel = model("User_GroupChannel", UserGroupChannelSchema);
export default UserGroupChannel;