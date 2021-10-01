const express = require('express');
const router  = express.Router();
const controllers = require('../controllers/users');

router.get('/', controllers.getAllUsers);
router.get('/:id', controllers.getUserById);
router.post('/', controllers.addUser);
router.put('/', controllers.updateUser);
router.delete('/:id', controllers.deleteUser);

module.exports = router;