const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

//= ===============================
// Chat Favourite Users Schema
//= ===============================
const ChatBlocksSchema = new Schema(
  {
    userId: {
      type: String, 
      required: true,
    },
    blockUser: {       
        type: Schema.Types.Object,
        ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // modelOption("c_ChatindiContent")
  {collection: "edu_c_ChatBlocks"}
);

model("ChatBlocks", ChatBlocksSchema);

// module.exports = mongoose.model("ChatFavs", ChatFavsSchema);
