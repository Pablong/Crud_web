const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bodegaRoutes = require('./routes/bodega.routes');
app.use('/api/bodegas', bodegaRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});


// MANEJO DE ERRORES GLOBAL
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor'
    });
});

module.exports = app;
