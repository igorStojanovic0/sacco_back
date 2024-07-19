const { Schema, model } = require('mongoose')
const { modelOption } = require('./config')

//= ===============================
// User Schema
//= ===============================
const emailSchema = new Schema(
  {
    // ---------- 1. Account기초정보 ----------
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now()
    },
    emailType: {
      type: Number,   
      required: true
    },
    send: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    recieve: {
      type: [Schema.Types.ObjectId],
      ref: 'users'
    },
    fileId: {
      type: [String],
      ref: 'file',
    },
    fileName: [String],
    del: { 
      type: Boolean,
      default: false
    },
    isView:
    {
      type: Boolean,
      default: false
    }
  },
  modelOption('emails')
);

model('Email', emailSchema);