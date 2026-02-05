// =============================================
// server.js - Punto de entrada de la aplicación
// =============================================

const app = require('./src/app');
const { closeConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// =============================================
// INICIAR SERVIDOR
// =============================================
const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Servidor Node.js iniciado');
    console.log('='.repeat(50));
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 API Bodegas: http://localhost:${PORT}/api/bodegas`);
    console.log(`� API Auth: http://localhost:${PORT}/api/auth/login`);
    console.log(`�🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50));
});

// =============================================
// GRACEFUL SHUTDOWN
// =============================================
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    
    // Cerrar conexiones a la base de datos
    await closeConnection();
    
    // Cerrar servidor HTTP
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

// =============================================
// MANEJO DE ERRORES NO CAPTURADOS
// =============================================
process.on('unhandledRejection', (err) => {
    console.error('❌ Error no manejado (Promise):', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Error no capturado:', err);
    process.exit(1);
});
