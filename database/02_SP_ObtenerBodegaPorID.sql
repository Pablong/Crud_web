-- =============================================
-- SP_ObtenerBodegaPorID
-- Descripción: Obtiene una bodega específica por su ID
-- Uso: Para cargar datos en el formulario de edición
-- Autor: Pablong
-- Fecha: 2026-02-05
-- =============================================

IF OBJECT_ID('SP_ObtenerBodegaPorID', 'P') IS NOT NULL
    DROP PROCEDURE SP_ObtenerBodegaPorID;
GO

CREATE PROCEDURE SP_ObtenerBodegaPorID
    @IdBodega NVARCHAR(5)  -- ID de la bodega a buscar (máximo 5 caracteres)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validación: Verificar que el ID no sea NULL o vacío
    IF @IdBodega IS NULL OR LTRIM(RTRIM(@IdBodega)) = ''
    BEGIN
        RAISERROR('El ID de bodega es requerido.', 16, 1);
        RETURN;
    END
    
    -- Validación: Verificar que la bodega exista
    IF NOT EXISTS (SELECT 1 FROM BODEGA WHERE IDBODEGA = @IdBodega)
    BEGIN
        RAISERROR('La bodega con ID %s no existe.', 16, 1, @IdBodega);
        RETURN;
    END
    
    -- Retornar todos los campos de la bodega
    SELECT 
        IDBODEGA,
        NOMBRE,
        DIRECCION,
        TELEFONOS,
        FAX,
        RESPONSABLE,
        IDUSUARIO_CREA,
        FECHA_CREA,
        IDUSUARIO_MODI,
        FECHA_MODI,
        TIPO,
        SERIE_DOCUMENTOS,
        VENDIBLE,
        ESTADO
    FROM 
        BODEGA
    WHERE 
        IDBODEGA = @IdBodega;
END
GO

-- =============================================
-- EJEMPLOS DE USO:
-- EXEC SP_ObtenerBodegaPorID 'BOD01'
-- EXEC SP_ObtenerBodegaPorID 'XXXXX'  -- Error: No existe
-- =============================================
