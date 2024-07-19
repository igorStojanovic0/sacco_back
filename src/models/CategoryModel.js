const { Schema, model } = require('mongoose')
const { modelOption } = require('./config')


const CategorySchema = new Schema({
  title: { type: String, required: true, trim: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category' },
  order: { type: Number },
  del: { type: Boolean, default: false }
}, modelOption('category'))

model('Category', CategorySchema)

// require('../controllers/admin/CategoryManageCtr').initCategorys()