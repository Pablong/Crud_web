-- =============================================
-- SP_EliminarBodega
-- Descripción: Elimina una bodega (Soft Delete)
-- Nota: No borra físicamente, solo cambia ESTADO a 'I'
-- Autor: Pablong
-- Fecha: 2026-02-05
-- =============================================

IF OBJECT_ID('SP_EliminarBodega', 'P') IS NOT NULL
    DROP PROCEDURE SP_EliminarBodega;
GO

CREATE PROCEDURE SP_EliminarBodega
    @IdBodega NVARCHAR(5),
    @IdUsuarioModi NVARCHAR(50)  -- Para auditoría
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
    
    -- Validar que no esté ya inactiva
    IF EXISTS (SELECT 1 FROM BODEGA WHERE IDBODEGA = @IdBodega AND ESTADO = 'I')
    BEGIN
        RAISERROR('La bodega con ID %s ya está inactiva.', 16, 1, @IdBodega);
        RETURN;
    END
    
    -- ============================================
    -- SOFT DELETE (Cambiar estado, no borrar físicamente)
    -- ============================================
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- SOFT DELETE: Solo cambiar el estado a Inactivo
        UPDATE BODEGA
        SET 
            ESTADO = 'I',              -- I = Inactivo
            IDUSUARIO_MODI = @IdUsuarioModi,
            FECHA_MODI = GETDATE()     -- Registrar cuándo se "eliminó"
        WHERE 
            IDBODEGA = @IdBodega;
        
        COMMIT TRANSACTION;
        
        -- Retornar éxito
        SELECT 
            'Bodega eliminada (inactivada) exitosamente.' AS Mensaje,
            @IdBodega AS IdBodega,
            GETDATE() AS FechaEliminacion;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR('Error al eliminar bodega: %s', @ErrorSeverity, @ErrorState, @ErrorMessage);
    END CATCH
END
GO

-- =============================================
-- EJEMPLOS DE USO:
--
-- ✅ Eliminar (inactivar) bodega:
-- EXEC SP_EliminarBodega 
--     @IdBodega = 'BOD01',
--     @IdUsuarioModi = 'USR002'
--
-- ❌ Error - No existe:
-- EXEC SP_EliminarBodega @IdBodega = 'XXXXX', @IdUsuarioModi = 'USR002'
--
-- ❌ Error - Ya está inactiva:
-- EXEC SP_EliminarBodega @IdBodega = 'BOD01', @IdUsuarioModi = 'USR002'
--
-- 💡 Para "deshacer" la eliminación (reactivar):
-- UPDATE BODEGA SET ESTADO = 'A', IDUSUARIO_MODI = 'USR003', FECHA_MODI = GETDATE()
-- WHERE IDBODEGA = 'BOD01'
-- =============================================
