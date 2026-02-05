-- =============================================
-- SP_ActualizarBodega
-- Descripción: Actualiza una bodega existente
-- Incluye: Auditoría (IDUSUARIO_MODI, FECHA_MODI)
-- Autor: Pablong
-- Fecha: 2026-02-05
-- =============================================

IF OBJECT_ID('SP_ActualizarBodega', 'P') IS NOT NULL
    DROP PROCEDURE SP_ActualizarBodega;
GO

CREATE PROCEDURE SP_ActualizarBodega
    @IdBodega NVARCHAR(5),
    @Nombre NVARCHAR(100),
    @Direccion NVARCHAR(200),
    @Telefonos NVARCHAR(50),
    @Fax NVARCHAR(50),
    @Responsable NVARCHAR(100),
    @IdUsuarioModi NVARCHAR(50),  -- Usuario que modifica
    @Tipo CHAR(1),
    @SerieDocumentos NVARCHAR(50),
    @Vendible CHAR(1),
    @Estado CHAR(1)  -- Puede cambiar el estado (A/I)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- ============================================
    -- VALIDACIONES
    -- ============================================
    
    -- Validar que el ID no sea NULL
    IF @IdBodega IS NULL OR LTRIM(RTRIM(@IdBodega)) = ''
    BEGIN
        RAISERROR('El ID de bodega es requerido.', 16, 1);
        RETURN;
    END
    
    -- Validar que la bodega exista
    IF NOT EXISTS (SELECT 1 FROM BODEGA WHERE IDBODEGA = @IdBodega)
    BEGIN
        RAISERROR('La bodega con ID %s no existe.', 16, 1, @IdBodega);
        RETURN;
    END
    
    -- Validar nombre
    IF @Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = ''
    BEGIN
        RAISERROR('El nombre de la bodega es requerido.', 16, 1);
        RETURN;
    END
    
    -- Validar estado
    IF @Estado NOT IN ('A', 'I')
    BEGIN
        RAISERROR('El estado solo puede ser A (Activo) o I (Inactivo).', 16, 1);
        RETURN;
    END
    
    -- Validar vendible
    IF @Vendible NOT IN ('S', 'N')
    BEGIN
        RAISERROR('El campo VENDIBLE solo puede ser S (Sí) o N (No).', 16, 1);
        RETURN;
    END
    
    -- ============================================
    -- ACTUALIZAR CON TRANSACCIÓN
    -- ============================================
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE BODEGA
        SET 
            NOMBRE = @Nombre,
            DIRECCION = @Direccion,
            TELEFONOS = @Telefonos,
            FAX = @Fax,
            RESPONSABLE = @Responsable,
            TIPO = @Tipo,
            SERIE_DOCUMENTOS = @SerieDocumentos,
            VENDIBLE = @Vendible,
            ESTADO = @Estado,
            -- ⚠️ CAMPOS DE AUDITORÍA (modificación)
            IDUSUARIO_MODI = @IdUsuarioModi,
            FECHA_MODI = GETDATE()
            -- ⚠️ NO tocamos IDUSUARIO_CREA ni FECHA_CREA (se preservan)
        WHERE 
            IDBODEGA = @IdBodega;
        
        COMMIT TRANSACTION;
        
        -- Retornar éxito
        SELECT 
            'Bodega actualizada exitosamente.' AS Mensaje,
            @IdBodega AS IdBodega,
            GETDATE() AS FechaModificacion;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR('Error al actualizar bodega: %s', @ErrorSeverity, @ErrorState, @ErrorMessage);
    END CATCH
END
GO

-- =============================================
-- EJEMPLOS DE USO:
--
-- ✅ Actualizar bodega existente:
-- EXEC SP_ActualizarBodega
--     @IdBodega = 'BOD01',
--     @Nombre = 'Bodega Central Actualizada',
--     @Direccion = 'Nueva Dirección #456',
--     @Telefonos = '555-9999',
--     @Fax = '555-8888',
--     @Responsable = 'María López',
--     @IdUsuarioModi = 'USR002',
--     @Tipo = 'P',
--     @SerieDocumentos = 'B',
--     @Vendible = 'S',
--     @Estado = 'A'
--
-- ❌ Error - No existe:
-- EXEC SP_ActualizarBodega @IdBodega = 'XXXXX', ... -- Error
-- =============================================
