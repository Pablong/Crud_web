// =============================================
// bodega.service.js - Servicio de acceso a datos
// Ejecuta los Stored Procedures de BODEGA
// =============================================

const { getConnection, sql } = require('../config/database');

// =============================================
// LISTAR TODAS LAS BODEGAS ACTIVAS
// =============================================
async function listarBodegas() {
    try {
        const pool = await getConnection();
        
        // Ejecutar SP sin parámetros
        const result = await pool.request()
            .execute('SP_ListarBodegas');
        
        // recordset contiene las filas retornadas
        return result.recordset;
        
    } catch (error) {
        throw error;
    }
}

// =============================================
// OBTENER UNA BODEGA POR ID
// =============================================
async function obtenerBodegaPorId(idBodega) {
    try {
        const pool = await getConnection();
        
        // Ejecutar SP con parámetro
        const result = await pool.request()
            .input('IdBodega', sql.NVarChar(5), idBodega)  // Parámetro de entrada
            .execute('SP_ObtenerBodegaPorID');
        
        // Retornar el primer registro (o null si no existe)
        return result.recordset[0] || null;
        
    } catch (error) {

        throw error;
    }
}

// =============================================
// CREAR NUEVA BODEGA
// =============================================
async function crearBodega(bodega) {
    try {
        const pool = await getConnection();
        
        // Ejecutar SP con múltiples parámetros
        const result = await pool.request()
            .input('IdBodega', sql.NVarChar(5), bodega.idBodega)
            .input('Nombre', sql.NVarChar(100), bodega.nombre)
            .input('Direccion', sql.NVarChar(200), bodega.direccion)
            .input('Telefonos', sql.NVarChar(50), bodega.telefonos)
            .input('Fax', sql.NVarChar(50), bodega.fax)
            .input('Responsable', sql.NVarChar(100), bodega.responsable)
            .input('IdUsuarioCrea', sql.NVarChar(50), bodega.idUsuarioCrea)
            .input('Tipo', sql.Char(1), bodega.tipo)
            .input('SerieDocumentos', sql.NVarChar(50), bodega.serieDocumentos)
            .input('Vendible', sql.Char(1), bodega.vendible)
            .execute('SP_CrearBodega');
        
        // El SP retorna un mensaje de éxito
        return result.recordset[0];
        
    } catch (error) {
        throw error;
    }
}

// =============================================
// ACTUALIZAR BODEGA EXISTENTE
// =============================================
async function actualizarBodega(idBodega, bodega) {
    try {
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('IdBodega', sql.NVarChar(5), idBodega)
            .input('Nombre', sql.NVarChar(100), bodega.nombre)
            .input('Direccion', sql.NVarChar(200), bodega.direccion)
            .input('Telefonos', sql.NVarChar(50), bodega.telefonos)
            .input('Fax', sql.NVarChar(50), bodega.fax)
            .input('Responsable', sql.NVarChar(100), bodega.responsable)
            .input('IdUsuarioModi', sql.NVarChar(50), bodega.idUsuarioModi)
            .input('Tipo', sql.Char(1), bodega.tipo)
            .input('SerieDocumentos', sql.NVarChar(50), bodega.serieDocumentos)
            .input('Vendible', sql.Char(1), bodega.vendible)
            .input('Estado', sql.Char(1), bodega.estado)
            .execute('SP_ActualizarBodega');
        
        return result.recordset[0];
        
    } catch (error) {
        throw error;
    }
}

// =============================================
// ELIMINAR BODEGA (SOFT DELETE)
// =============================================
async function eliminarBodega(idBodega, idUsuarioModi) {
    try {
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('IdBodega', sql.NVarChar(5), idBodega)
            .input('IdUsuarioModi', sql.NVarChar(50), idUsuarioModi)
            .execute('SP_EliminarBodega');
        
        return result.recordset[0];
        
    } catch (error) {
        throw error;
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