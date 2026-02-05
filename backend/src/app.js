// =============================================
// app.js - Configuración de Express
// =============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// MIDDLEWARES
// CORS - Permitir peticiones desde Angular (puerto 4200)
app.use(cors());

// Parsear JSON en el body de las peticiones
app.use(express.json());

// Parsear URL-encoded (formularios)
app.use(express.urlencoded({ extended: true }));

// Rutas de bodegas
const bodegaRoutes = require('./routes/bodega.routes');
app.use('/api/bodegas', bodegaRoutes);

// Rutas de autenticación
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);


// MANEJO DE RUTAS NO ENCONTRADAS (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});


// MANEJO DE ERRORES GLOBAL
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;
