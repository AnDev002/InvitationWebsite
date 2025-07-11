const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateUser, validateLogin } = require('../utils/validators');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// POST /api/auth/register
router.post('/register', validateUser, authController.register);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);
router.post('/logout', isAuthenticated, authController.logout);

module.exports = router;