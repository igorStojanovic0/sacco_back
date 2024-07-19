const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseApiQuery = require('mongoose-api-query');

const NotificationSchema = new Schema(
  {
    // uid: {                // user _id
    //   type: String,
    //   required: true,
    // },
    uid: {                // user _id
      type: Schema.Types.ObjectId,
			ref: 'User',
      required: true,
    },
    type: String,         // Defined variables to filter notifications
    data: Object,
    objId: String
  },
  {
    timestamps: true
  }
);
NotificationSchema.plugin(mongooseApiQuery);
module.exports = mongoose.model('notifications', NotificationSchema);
