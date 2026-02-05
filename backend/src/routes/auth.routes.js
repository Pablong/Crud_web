const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/login - Validar credenciales
router.post('/login', authController.login);

module.exports = router;
