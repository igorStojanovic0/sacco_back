const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const AlarmSchema = Schema(
    {
        type: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        users: [{
            id: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'User',
            },
            read: {
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
        }],
        url: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
        collection: process.env.MODEL_PREFIX + 'alarm',
    }
)

model('Alarm', AlarmSchema)