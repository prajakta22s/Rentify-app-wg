const express = require('express');
const router = express.Router();
const { addProperty, getProperties, updateProperty, deleteProperty, likeProperty, interestedInProperty } = require('../controllers/propertyController');
const upload = require('../middleware/upload');

router.post('/properties', upload.single('image'), addProperty);
router.get('/properties', getProperties);
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);
router.post('/properties/:id/like', likeProperty);
router.post('/properties/:id/interested', interestedInProperty);

module.exports = router;
