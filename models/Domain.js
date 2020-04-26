const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  ip: String,
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Domain', schema);
