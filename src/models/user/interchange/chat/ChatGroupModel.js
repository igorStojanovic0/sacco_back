const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatGroupSchema = new Schema(
	{
		title: {
			type: String
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		users: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
		isArchived: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true
	}
);
module.exports = mongoose.model('chatgroups', ChatGroupSchema);
