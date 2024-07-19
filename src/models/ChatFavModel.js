const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

//= ===============================
// Chat Favourite Users Schema
//= ===============================
const ChatFavsSchema = new Schema(
  {
    userId: {
      type: String, 
      required: true,
    },
    favUser: {       
        type: Schema.Types.Object,
        ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // modelOption("c_ChatindiContent")
  {collection: "edu_c_ChatFavs"}
);

model("ChatFavs", ChatFavsSchema);

// module.exports = mongoose.model("ChatFavs", ChatFavsSchema);
