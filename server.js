const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');

route.get('/', userController.list);
route.get('/:id', userController.getById);

module.exports = route;