const mongoose      = require('mongoose');

const Schema        = mongoose.Schema;

const LoginUserSchema = new Schema(
  {
    userID: String,
    realName: String,
    ip: String,
    lastAccess: Date,
    expire: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('login_user', LoginUserSchema);
