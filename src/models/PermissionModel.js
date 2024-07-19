const { Schema, model } = require('mongoose')
const { modelOption } = require('./config')

const permissionSchema = new Schema({
  title: { type: String, required: true },
  del: { type: Boolean, default: false }
}, modelOption('a_permission'))

model('Permission', permissionSchema)