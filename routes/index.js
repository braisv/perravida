const express = require('express');
const router  = express.Router();
const userRoutes = require('./users');
const friendRoutes = require('./friends');

router.use('/users', userRoutes);
router.use('/friends', friendRoutes);

module.exports = router;

