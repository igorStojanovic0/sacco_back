const { Schema, model } = require('mongoose')
const { modelOption } = require('./config')


const teamSchema = new Schema({
  title: { type: String, required: true, trim: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Team' },
  order: { type: Number },
  deletedAt: { type: Date },
  active: { type: Boolean, default: true },
  scorable: { type: Boolean, default: true },
}, modelOption('team'))

model('Team', teamSchema)

// require('../controllers/admin/GroupManageCtr').initGroups()