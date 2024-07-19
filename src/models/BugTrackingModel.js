const { Schema, model } = require('mongoose');
//const mongooseApiQuery      = require('mongoose-api-query');
const { modelOption } = require('./config')

const BugTracking = new Schema(
    {
        idx: Number,            // auto increase
        category: {
            cid: Schema.ObjectId,
            cname: String,
        },
        summary: [String],
        content: {
            type: String,
            default: "No data available"
        },
        summary: [String],
        title: {
            type: String
        },
        revision: {
            type: Number
        },
        priority: {
            type: Number,
            default: 0
        },
        type: String,
        status: {
            type: String
        },
        avatar: {
            type: String,
            default: "user",
        },
        reporter: {
            uid: {
                type: Schema.ObjectId,
                ref: 'User',
                required: true
            },
            team: {
                type: Schema.ObjectId,
                ref: 'Team'
            },
            group: {
                type: Schema.ObjectId,
                ref: 'Group'
            },
            userID: String,
            realName: String,
        },
        assignee: {
            uid: {
                type: Schema.ObjectId,
                ref: 'User',
            },
            userID: {
                type: String,
                default: "Unassigned"
            },
            team: {
                type: Schema.ObjectId,
                ref: 'Team'
            },
            group: {
                type: Schema.ObjectId,
                ref: 'Group'
            },
            realName: {
                type: String,
                default: "Unassigned"
            }
        },
        histories: [{
            uid: { type: Schema.ObjectId, required: true },
            userID: String,
            realName: String,
            kind: String,
            // NEW_ISSUE:  
            // ADD_NOTE:  
            // STATUS_CHANGE:  
            // ASSIGNED: 
            // DELETE_NOTE: 
            // EDIT_NOTE: 

            // kind = STATUS_CHANGE
            prevStatus: String, //
            curStatus: String,

            // kind = ADD_NOTE, DELETE_NOTE, EDIT_NOTE
            nIdx: Number,

            // kind = ASSIGNED
            prevUser: {
                uid: String,
                userID: String,
                realName: String
            },
            curUser: {
                uid: String,
                userID: String,
                realName: String
            },
            createdAt: String
        }],
        notes: [{
            nIdx: Number,
            uid: String,
            userID: String,
            realName: String,
            content: String,
            team: {
                type: Schema.ObjectId,
                ref: 'Team'
            },
            avatar: {
                type: String,
                default: "user",
            },
            files: [{
                type: Schema.Types.ObjectId,
                ref: 'File'
            }],
            createdAt: String
        }],
        files: [{
            type: Schema.Types.ObjectId,
            ref: 'File'
        }],
    }, modelOption('bugTracking')
);

model('BugTracking', BugTracking)
