const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    
    options: {
        encrypt: true,  // Cambiar a true para servidores remotos
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,  // 30 segundos (aumentado)
        requestTimeout: 30000      // 30 segundos para queries
    },
    
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;
/**
 * @returns {Promise<sql.ConnectionPool>} 
 *
 *  */

async function getConnection() {
    try{
        if (pool && pool.connected) {
            return pool;
        }
        
        console.log("Conectando a SQL server...");
        pool = await sql.connect(config);
        console.log("Conexión exitosa a SQL server");
        return pool;

    } catch (error) {
        console.error("Error al conectar a SQL server:", error.message);
        throw error;
    }
}

async function closeConnection() {
    try {
        if (pool) {
            await pool.close();
            console.log("Conexión a SQL server cerrada");
        }
    } catch (error) {
        console.error("Error al cerrar la conexión a SQL server:", error.message);
    }
}

module.exports = {
    getConnection,
    closeConnection,
    sql
};