const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{10}$/,
  },
  weight: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    default: 1000,
  },
  total: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
});

const invoiceModel = mongoose.model('Invoice', invoiceSchema, 'invoices');

invoiceModel.collection.dropIndex('email_1').catch(() => {});
invoiceModel.collection.dropIndex('phone_1').catch(() => {});

module.exports = invoiceModel;
