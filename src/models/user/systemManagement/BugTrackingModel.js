const mongoose              = require('mongoose');
const mongooseApiQuery      = require('mongoose-api-query');
const Schema                = mongoose.Schema;

const BugTracking = new Schema(
	{
        idx: Number,            // Auto increase
        category: {             // category item
            cid: String,
            cname: String
        },
		title: {                // title
			type: String
        },
        revision: {             // revision
            type: Number
        },
        priority: {             // priority
            type: String
        },
        status: {               // status
            // NEW: opened, 
            // CONFIRMED: accepted, 
            // FEEDBACK: unaccepted,
            // RESOLVED: resolved, 
            // REOPENED: reopened, 
            // CLOSED: closed 
            // ASSIGNED: assigned
            type: String    
        },
		reporter: {             // reporter
			uid: String,
			userID: String,
			realName: String,
        },
        receiver: {
            uid: String,
            userID: String,
            realName: String
        },
        histories: [{ 
            uid: String,
            userID: String,
            realName: String,
            kind: String,       // NEW_ISSUE: newly opened, 
                                // ADD_NOTE: add note, 
                                // STATUS_CHANGE: status change, 
                                // ASSIGNED: assign
                                // DELETE_NOTE: note delete
                                // EDIT_NOTE: note edit

            // kind = STATUS_CHANGE
            prevStatus: String, // if kind is STATUS_CHANGE, prev status
            curStatus: String,  // if kind is STATUS_CHANGE, NEW_ISSUE, current status
            
            // kind = ADD_NOTE, DELETE_NOTE, EDIT_NOTE
            nIdx: Number,       // if kind is ADD_NOTE, DELETE_NOTE, comment number

            // kind = ASSIGNED
            prevUser: {         // if kind is ASSIGNED, prev assigner
                uid: String,
                userID: String,
                realName: String
            },
            curUser: {          // if kind is ASSIGNED, current assigner
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
            files: [{
                type: Schema.Types.ObjectId,
                ref: 'files'
            }],
            createdAt: String
        }],
	},
	{
		timestamps: true
	}
);

BugTracking.plugin(mongooseApiQuery);
module.exports = mongoose.model('bugtrackings', BugTracking);
