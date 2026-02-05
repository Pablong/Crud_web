-- =============================================
-- Tabla: USER_DEV
-- Descripción: Almacena usuarios para autenticación
-- Autor: Pablong
-- Fecha: 2026-02-05
-- =============================================

-- Crear tabla USER_DEV
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='USER_DEV' AND xtype='U')
BEGIN
    CREATE TABLE USER_DEV (
        IDUSUARIO NVARCHAR(50) NOT NULL PRIMARY KEY,
        NOMBRE NVARCHAR(100) NOT NULL,
        EMAIL NVARCHAR(100),
        PASSWORD NVARCHAR(255) NOT NULL,  -- Contraseña hasheada
        ESTADO CHAR(1) NOT NULL DEFAULT 'A',  -- A=Activo, I=Inactivo
        FECHA_CREA DATETIME NOT NULL DEFAULT GETDATE(),
        FECHA_MODI DATETIME,
        ULTIMO_LOGIN DATETIME
    );
    
    PRINT '✅ Tabla USER_DEV creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ La tabla USER_DEV ya existe';
END
GO

-- =============================================
-- Insertar usuario de prueba
-- Usuario: admin
-- Password: admin123 (en producción usar hash bcrypt)
-- =============================================

IF NOT EXISTS (SELECT 1 FROM USER_DEV WHERE IDUSUARIO = 'admin')
BEGIN
    INSERT INTO USER_DEV (IDUSUARIO, NOMBRE, EMAIL, PASSWORD, ESTADO)
    VALUES ('admin', 'Administrador', 'admin@example.com', 'admin123', 'A');
    
    PRINT '✅ Usuario admin creado - Password: admin123';
END
ELSE
BEGIN
    PRINT '⚠️ El usuario admin ya existe';
END
GO

-- =============================================
-- SP: Validar Login
-- =============================================

IF OBJECT_ID('SP_ValidarLogin', 'P') IS NOT NULL
    DROP PROCEDURE SP_ValidarLogin;
GO

CREATE PROCEDURE SP_ValidarLogin
    @Usuario NVARCHAR(50),
    @Password NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UsuarioEncontrado NVARCHAR(50);
    DECLARE @Estado CHAR(1);
    
    -- Buscar usuario
    SELECT 
        @UsuarioEncontrado = IDUSUARIO,
        @Estado = ESTADO
    FROM USER_DEV
    WHERE IDUSUARIO = @Usuario AND PASSWORD = @Password;
    
    -- Validaciones
    IF @UsuarioEncontrado IS NULL
    BEGIN
        RAISERROR('Usuario o contraseña incorrectos.', 16, 1);
        RETURN;
    END
    
    IF @Estado = 'I'
    BEGIN
        RAISERROR('Usuario inactivo. Contacte al administrador.', 16, 1);
        RETURN;
    END
    
    -- Actualizar último login
    UPDATE USER_DEV 
    SET ULTIMO_LOGIN = GETDATE()
    WHERE IDUSUARIO = @Usuario;
    
    -- Retornar datos del usuario
    SELECT 
        IDUSUARIO,
        NOMBRE,
        EMAIL,
        ULTIMO_LOGIN,
        'Login exitoso' AS Mensaje
    FROM USER_DEV
    WHERE IDUSUARIO = @Usuario;
END
GO

-- =============================================
-- EJEMPLOS DE USO:
--
-- ✅ Login exitoso:
-- EXEC SP_ValidarLogin 'admin', 'admin123'
--
-- ❌ Credenciales incorrectas:
-- EXEC SP_ValidarLogin 'admin', 'wrongpass'
--
-- Ver usuarios:
-- SELECT * FROM USER_DEV
-- =============================================

PRINT '✅ Script ejecutado completamente';
