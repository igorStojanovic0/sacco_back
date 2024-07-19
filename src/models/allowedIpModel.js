const { Schema, model } = require('mongoose')
const { modelOption } = require('./config')

const payTypeSchema = new Schema({
    title: { type: String, required: true },
    del: { type: Boolean, default: false },
    type: { type: String, default: 'other' }
}, modelOption('allowedIp'))

model('AllowedIp', payTypeSchema)