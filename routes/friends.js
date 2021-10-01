const express = require('express');
const router  = express.Router();
const controllers = require('../controllers/friends');

router.get('/:id', controllers.getUserFriends);
router.get('/:id/count', controllers.getUserFriendsCount);

module.exports = router;