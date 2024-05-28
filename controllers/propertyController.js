const Property = require('../models/Property');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const addProperty = async (req, res) => {
  const { sellerId, title, description, location, minPrice, maxPrice, area, nearby } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const property = new Property({ sellerId, title, description, location, minPrice, maxPrice, area, nearby, imageUrl });
    await property.save();
    res.status(201).send({ message: 'Property added successfully', property });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getProperties = async (req, res) => {
  const { sellerId } = req.query;
  try {
    const properties = await Property.find(sellerId ? { sellerId } : {});
    res.status(200).send(properties);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const likeProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    property.likes += 1;
    await property.save();
    res.status(200).send({ message: 'Property liked successfully', property });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const interestedInProperty = async (req, res) => {
  const { userId } = req.body;
  try {
    const property = await Property.findById(req.params.id);
    property.interestedBuyers.push(userId);
    await property.save();

    const buyer = await User.findById(userId);
    const seller = await User.findById(property.sellerId);

    // Send email to seller
    const mailOptionsSeller = {
      from: process.env.EMAIL_USER,
      to: seller.email,
      subject: 'New Interested Buyer',
      text: `Hello ${seller.firstName},\n\n${buyer.firstName} is interested in your property titled "${property.title}".\n\nContact details:\nEmail: ${buyer.email}\nPhone: ${buyer.phoneNumber}`,
    };
    transporter.sendMail(mailOptionsSeller, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent to seller: ' + info.response);
      }
    });

    // Send email to buyer
    const mailOptionsBuyer = {
      from: process.env.EMAIL_USER,
      to: buyer.email,
      subject: 'Interest Confirmation',
      text: `Hello ${buyer.firstName},\n\nYou have shown interest in the property titled "${property.title}" owned by ${seller.firstName}. You can contact the seller via email: ${seller.email} or phone: ${seller.phoneNumber}`,
    };
    transporter.sendMail(mailOptionsBuyer, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent to buyer: ' + info.response);
      }
    });

    res.status(200).send({ message: 'Interest noted and emails sent', seller });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { addProperty, getProperties, updateProperty, deleteProperty, likeProperty, interestedInProperty };
