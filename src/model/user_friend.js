const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserFriendSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
        friendId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		groupId: {
			type: Schema.Types.ObjectId,
			ref: 'Group'
		},
		roomId: { type: String },
	},
	{
		timestamps: true
	}
);
module.exports = mongoose.model('user_friends', UserFriendSchema);
