const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Роуты
router.post('/register', authController.register);
router.get('/activate/:link', authController.activate);
router.post('/login', authController.login);

module.exports = router;
