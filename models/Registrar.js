const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: {type: String, required: true},
  callbackUrl: {type: String, required: true},
  access_key: String,
}, { timestamps: { createdAt: true, updatedAt: true}});

module.exports = mongoose.model('Registrar', schema);
