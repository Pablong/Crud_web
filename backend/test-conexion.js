// test-conexion.js - Prueba de conexión
const { getConnection, closeConnection } = require('./src/config/database');

async function testConnection() {
    try {
        console.log('🔌 Intentando conectar...');
        
        const pool = await getConnection();
        
        console.log('✅ Conexión exitosa!');
        console.log('📊 Base de datos:', pool.config.database);
        
        // Prueba simple: obtener la fecha del servidor
        const result = await pool.request().query('SELECT GETDATE() AS FechaServidor');
        console.log('📅 Fecha del servidor SQL:', result.recordset[0].FechaServidor);
        
        await closeConnection();
        console.log('👋 Conexión cerrada');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testConnection();