const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    
    options: {
        encrypt: false, 
        trustServerCertificate: true,
        enableArithAbort: true
    },
    
    connectionTimeout: 60000,
    requestTimeout: 60000,
    
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

async function getConnection() {
    try {
        if (pool && pool.connected) {
            return pool;
        }
        
        pool = await sql.connect(config);
        return pool;
    } catch (error) {
        pool = null;
        throw error;
    }
}

async function closeConnection() {
    try {
        if (pool) {
            await pool.close();
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getConnection,
    closeConnection,
    sql
};