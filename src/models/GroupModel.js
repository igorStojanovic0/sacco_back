const { Schema, model } = require('mongoose')
const { modelOption } = require('./config')

const groupSchema = new Schema({
  title: { type: String, required: true, trim: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Group' },
  order: { type: Number },
  deletedAt: { type: Date },
  active: { type: Boolean, default: true },
}, modelOption('group'))

model('Group', groupSchema)

// require('../controllers/admin/GroupManageCtr').initGroups()