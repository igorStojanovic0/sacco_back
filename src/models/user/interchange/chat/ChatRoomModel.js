const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema(
	{
		title: {
			type: String
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'chatgroups'
		},
		users: [{
			userId: String,
			msgStartIndex: Number,
			msgLastReadIndex: Number,
		}],
		mutedUsers: [{
			userId: Schema.Types.ObjectId
		}],
		isPublic: {
			type: Boolean,
			required: true,
			default: false,
		},
		isArchived: {
			type: Boolean,
			required: true,
			default: false,
		},
		messages: [{
			msgType: String, // NORMAL, FILE, EDITED, DELETED, USER_ADDED, USER_LEAVE, USER_REMOVED,
			creatorId: String, // Schema.Types.ObjectId
			content: String,
			contentUserId: String, // USER_ADDED, USER_LEAVE, USER_REMOVED
			file: { // file only
				id: String,
				name: String,
				mime: String,
				md5: String,
				filesize: Number,
				downloaded: [{
					userId: String,
					createdAt: String
				}],
			},
			created: {
				type: Date,
				default: Date.now,
				required: true,
			},
			recommend: [{
				userId: String, // Schema.Types.ObjectId
				emoIndex: String,
			}]
		}],
		messageTotalCount: {
			type: Number,
			required: true,
			default: 0,
		}
	},
	{
		timestamps: true
	}
);
module.exports = mongoose.model('chatrooms', ChatRoomSchema);
