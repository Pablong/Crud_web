-- =============================================
-- SP_CrearBodega
-- Descripción: Crea una nueva bodega con validaciones
-- Incluye: Transacciones, manejo de errores, validaciones de negocio
-- Autor: Pablong
-- Fecha: 2026-02-05
-- =============================================

IF OBJECT_ID('SP_CrearBodega', 'P') IS NOT NULL
    DROP PROCEDURE SP_CrearBodega;
GO

CREATE PROCEDURE SP_CrearBodega
    -- Parámetros obligatorios
    @IdBodega NVARCHAR(5),
    @Nombre NVARCHAR(100),
    @Direccion NVARCHAR(200),
    @Telefonos NVARCHAR(50),
    @Fax NVARCHAR(50),
    @Responsable NVARCHAR(100),
    @IdUsuarioCrea NVARCHAR(50),
    @Tipo CHAR(1),
    @SerieDocumentos NVARCHAR(50),
    @Vendible CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- ============================================
    -- PASO 1: VALIDACIONES PREVIAS
    -- ============================================
    
    -- Validar que campos obligatorios no sean NULL
    IF @IdBodega IS NULL OR LTRIM(RTRIM(@IdBodega)) = ''
    BEGIN
        RAISERROR('El ID de bodega es requerido.', 16, 1);
        RETURN;
    END
    
    IF @Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = ''
    BEGIN
        RAISERROR('El nombre de la bodega es requerido.', 16, 1);
        RETURN;
    END
    
    -- Validar longitud de IDBODEGA (máximo 5 caracteres)
    IF LEN(@IdBodega) > 5
    BEGIN
        RAISERROR('El ID de bodega no puede tener más de 5 caracteres.', 16, 1);
        RETURN;
    END
    
    -- Validar que el ID no exista (debe ser único)
    IF EXISTS (SELECT 1 FROM BODEGA WHERE IDBODEGA = @IdBodega)
    BEGIN
        RAISERROR('Ya existe una bodega con el ID %s.', 16, 1, @IdBodega);
        RETURN;
    END
    
    -- Validar que VENDIBLE sea 'S' o 'N'
    IF @Vendible NOT IN ('S', 'N')
    BEGIN
        RAISERROR('El campo VENDIBLE solo puede ser S (Sí) o N (No).', 16, 1);
        RETURN;
    END
    
    -- ============================================
    -- PASO 2: INSERTAR CON TRANSACCIÓN
    -- ============================================
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO BODEGA (
            IDBODEGA,
            NOMBRE,
            DIRECCION,
            TELEFONOS,
            FAX,
            RESPONSABLE,
            IDUSUARIO_CREA,
            FECHA_CREA,      -- Se genera automáticamente
            TIPO,
            SERIE_DOCUMENTOS,
            VENDIBLE,
            ESTADO           -- Por defecto: Activa
        )
        VALUES (
            @IdBodega,
            @Nombre,
            @Direccion,
            @Telefonos,
            @Fax,
            @Responsable,
            @IdUsuarioCrea,
            GETDATE(),       -- Fecha actual del servidor
            @Tipo,
            @SerieDocumentos,
            @Vendible,
            'A'              -- A = Activa (default)
        );
        
        COMMIT TRANSACTION;
        
        -- Retornar mensaje de éxito con el ID creado
        SELECT 
            'Bodega creada exitosamente.' AS Mensaje,
            @IdBodega AS IdBodega,
            GETDATE() AS FechaCreacion;
        
    END TRY
    BEGIN CATCH
        -- Si algo falla, revertir todos los cambios
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        -- Capturar y retornar información del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        DECLARE @ErrorLine INT = ERROR_LINE();
        
        -- Re-lanzar el error con información detallada
        RAISERROR('Error al crear bodega (Línea %d): %s', 
                  @ErrorSeverity, 
                  @ErrorState, 
                  @ErrorLine,
                  @ErrorMessage);
    END CATCH
END
GO

-- =============================================
-- EJEMPLOS DE USO:
-- 
-- ✅ Caso exitoso:
-- EXEC SP_CrearBodega 
--     @IdBodega = 'BOD01',
--     @Nombre = 'Bodega Central',
--     @Direccion = 'Av. Principal #123',
--     @Telefonos = '555-1234',
--     @Fax = '555-5678',
--     @Responsable = 'Juan Pérez',
--     @IdUsuarioCrea = 'USR001',
--     @Tipo = 'P',
--     @SerieDocumentos = 'A',
--     @Vendible = 'S'
--
-- ❌ Error - ID ya existe:
-- EXEC SP_CrearBodega @IdBodega = 'BOD01', ... -- Error
--
-- ❌ Error - ID muy largo:
-- EXEC SP_CrearBodega @IdBodega = 'ABCDEF', ... -- Error: >5 caracteres
-- =============================================
