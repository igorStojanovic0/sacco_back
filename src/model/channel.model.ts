import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";


const ChannelSchema = new Schema({
    group_id: { type: ObjectId,
        ref: 'Group'
    },
    name: { type: String, require: true},
    description: { type: String },
    users: { type: ObjectId,
        ref: 'User'
    },
    created_by: { type: ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const Channel = model("Channel", ChannelSchema);
export default Channel;