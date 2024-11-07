const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  lineItem: { type: Number, required: true },
  description: { type: String, required: true },
  estimateAmount: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  customerId: { type: Number, required: true },
  customerName: { type: String, required: true },
  orderId: { type: Number },
  lineItems: [lineItemSchema],
  deliveryDate: { type: Date, required: true },
  remarks: { type: String }
});

orderSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  const lastOrder = await mongoose.model('Order').findOne().sort({ orderId: -1 });
  this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
