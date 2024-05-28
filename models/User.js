const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Change from 'bcrypt' to 'bcryptjs'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  userType: { type: String, required: true }, // 'buyer' or 'seller'
  password: { type: String, required: true },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
