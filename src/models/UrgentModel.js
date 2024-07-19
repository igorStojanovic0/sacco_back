const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");
// const mongoose = require("mongoose");
// const config = require("../../config");

const urgentSchema = new Schema({
    reporter_id: {
        type: Schema.Types.ObjectId,
        ref: process.env.MODEL_PREFIX + "_users",
        required: true,
    },
    reporter_realName: {
        type: String,
    },
    title: {
        type: String,
        required: [true, "Must be provided list title"],
        trim: true,
    },
    receivers: [{
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        delflag: {
            type: Boolean,
            default: false
        }
    }],
    delflag: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    },
    modelOption('Urgent')
);

model("Urgent", urgentSchema);