import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";

const GroupChannelSchema = new Schema({
    name: { type: String, required: true },
    channel_avatar: { type: String, required: true, default: 'default'},
    created_by: { type: ObjectId, 
        ref: 'User'
    },
    group_id: { type: String },
    del_flag: { type: Number, default: 0},
},{
    timestamps: true
});

const GroupChannel = model("GroupChannel", GroupChannelSchema);
export default GroupChannel;
