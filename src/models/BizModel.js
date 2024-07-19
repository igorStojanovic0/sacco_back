const { Schema, model } = require('mongoose')
const { modelOption } = require('./config')

const bizSchema = new Schema({
  title: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: process.env.MODEL_PREFIX + 'biz' },
  idPath: { type: String },
  parentNum: { type: String },
  actions: [{ type: String }],
  link: { type: String },
  path: { type: String },
  pos: { type: String },
  posPath: { type: String },
  del: { type: Boolean, default: false }
}, modelOption('biz'))

model('Biz', bizSchema)

require('../controllers/admin/BizManageCtr').initBizs()