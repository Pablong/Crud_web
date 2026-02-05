const sql = require('mssql');
const { getConnection } = require('../config/database');

const authService = {
  /**
   * Valida las credenciales del usuario
   * @param {string} usuario - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Datos del usuario si es válido
   */
  async validarLogin(usuario, password) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('USUARIO', sql.NVarChar(50), usuario)
        .input('PASSWORD', sql.NVarChar(100), password)
        .execute('SP_ValidarLogin');

      // El SP retorna el usuario si es válido, vacío si no
      if (result.recordset.length > 0) {
        return result.recordset[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error en validarLogin:', error);
      throw error;
    }
  }
};

module.exports = authService;
