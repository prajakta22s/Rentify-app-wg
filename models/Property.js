const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  area: { type: Number, required: true },
  nearby: { type: String, required: true },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  interestedBuyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
