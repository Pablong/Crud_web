const authService = require('../services/auth.service');

const authController = {
  /**
   * POST /api/auth/login
   * Valida las credenciales y retorna los datos del usuario
   */
  async login(req, res) {
    try {
      const { usuario, password } = req.body;

      // Validar que se enviaron los campos requeridos
      if (!usuario || !password) {
        return res.status(400).json({
          error: 'Usuario y contraseña son requeridos'
        });
      }

      // Validar credenciales
      const user = await authService.validarLogin(usuario, password);

      if (!user) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // No enviar la contraseña en la respuesta
      delete user.PASSWORD;

      res.status(200).json(user);
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error al validar credenciales',
        details: error.message
      });
    }
  }
};

module.exports = authController;
