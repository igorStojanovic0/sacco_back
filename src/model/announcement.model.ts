import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";


const AnnouncementSchema = new Schema({
    group_id: { type: ObjectId,
        ref: 'Group'
    },
    title: { type: String, require: true},
    description: { type: String, require: true},
    created_by: { type: ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const Announcement = model("Announcement", AnnouncementSchema);
export default Announcement;