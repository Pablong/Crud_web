// =============================================
// bodega.controller.js - Controlador de Bodegas
// Maneja la lógica de negocio y respuestas HTTP
// =============================================

const bodegaService = require('../services/bodega.service');

// =============================================
// GET /api/bodegas - Listar todas las bodegas
// =============================================
async function listarBodegas(req, res) {
    try {
        const bodegas = await bodegaService.listarBodegas();
        
        res.status(200).json({
            success: true,
            data: bodegas,
            message: 'Bodegas obtenidas exitosamente'
        });
        
    } catch (error) {
        console.error('Error en listarBodegas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las bodegas',
            error: error.message
        });
    }
}

// =============================================
// GET /api/bodegas/:id - Obtener bodega por ID
// =============================================
async function obtenerBodegaPorId(req, res) {
    try {
        const { id } = req.params;
        const bodega = await bodegaService.obtenerBodegaPorId(id);
        
        if (!bodega) {
            return res.status(404).json({
                success: false,
                message: `Bodega con ID ${id} no encontrada`
            });
        }
        
        res.status(200).json({
            success: true,
            data: bodega,
            message: 'Bodega obtenida exitosamente'
        });
        
    } catch (error) {
        console.error('Error en obtenerBodegaPorId:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la bodega',
            error: error.message
        });
    }
}

// =============================================
// POST /api/bodegas/crear - Crear nueva bodega
// =============================================
async function crearBodega(req, res) {
    try {
        const bodega = req.body;
        
        // Validación básica
        if (!bodega.idBodega || !bodega.nombre) {
            return res.status(400).json({
                success: false,
                message: 'IdBodega y Nombre son requeridos'
            });
        }
        
        const resultado = await bodegaService.crearBodega(bodega);
        
        res.status(201).json({
            success: true,
            data: resultado,
            message: 'Bodega creada exitosamente'
        });
        
    } catch (error) {
        console.error('Error en crearBodega:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la bodega',
            error: error.message
        });
    }
}

// =============================================
// PUT /api/bodegas/:id - Actualizar bodega
// =============================================
async function actualizarBodega(req, res) {
    try {
        const { id } = req.params;
        const bodega = req.body;
        
        const resultado = await bodegaService.actualizarBodega(id, bodega);
        
        res.status(200).json({
            success: true,
            data: resultado,
            message: 'Bodega actualizada exitosamente'
        });
        
    } catch (error) {
        console.error('Error en actualizarBodega:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la bodega',
            error: error.message
        });
    }
}

// =============================================
// DELETE /api/bodegas/:id - Eliminar bodega (soft delete)
// =============================================
async function eliminarBodega(req, res) {
    try {
        const { id } = req.params;
        const { idUsuarioModi } = req.body;
        
        if (!idUsuarioModi) {
            return res.status(400).json({
                success: false,
                message: 'idUsuarioModi es requerido'
            });
        }
        
        const resultado = await bodegaService.eliminarBodega(id, idUsuarioModi);
        
        res.status(200).json({
            success: true,
            data: resultado,
            message: 'Bodega eliminada exitosamente'
        });
        
    } catch (error) {
        console.error('Error en eliminarBodega:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la bodega',
            error: error.message
        });
    }
}

// =============================================
// EXPORTAR FUNCIONES
// =============================================
module.exports = {
    listarBodegas,
    obtenerBodegaPorId,
    crearBodega,
    actualizarBodega,
    eliminarBodega
};
