const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, userType, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, phoneNumber, userType, password: hashedPassword });
    await user.save();

    // Send email to user upon successful registration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Registration Successful',
      text: `Hello ${user.firstName},\n\nYou have successfully registered.\n\nThank you!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).send({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
