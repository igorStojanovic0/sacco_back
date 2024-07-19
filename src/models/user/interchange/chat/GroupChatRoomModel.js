const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupChatRoomSchema = new Schema(
	{
		creatorId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		groupId: {
			type: Schema.Types.ObjectId,
			ref: 'Group'
		},
		roomId: { type: String },
		content: { type: String },
		
		created: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	{
		timestamps: true
	}
);
module.exports = mongoose.model('groupchatrooms', GroupChatRoomSchema);
