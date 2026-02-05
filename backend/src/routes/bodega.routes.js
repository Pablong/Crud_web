// =============================================
// bodega.routes.js - Rutas de Bodegas
// Define los endpoints REST
// =============================================

const express = require('express');
const router = express.Router();
const bodegaController = require('../controllers/bodega.controller');

// =============================================
// RUTAS CRUD
// =============================================

// GET /api/bodegas - Listar todas las bodegas
router.get('/', bodegaController.listarBodegas);

// GET /api/bodegas/:id - Obtener bodega por ID
router.get('/:id', bodegaController.obtenerBodegaPorId);

// POST /api/bodegas/crear - Crear nueva bodega
router.post('/crear', bodegaController.crearBodega);

// PUT /api/bodegas/:id - Actualizar bodega
router.put('/:id', bodegaController.actualizarBodega);

// DELETE /api/bodegas/:id - Eliminar bodega (soft delete)
router.delete('/:id', bodegaController.eliminarBodega);

module.exports = router;
