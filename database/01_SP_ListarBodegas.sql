-- =============================================
-- SP_ListarBodegas
-- Descripción: Lista todas las bodegas activas
-- Autor: Pablong
-- Fecha: 2026-02-05
-- =============================================

-- Si el SP existe, lo eliminamos para recrearlo
IF OBJECT_ID('SP_ListarBodegas', 'P') IS NOT NULL
    DROP PROCEDURE SP_ListarBodegas;
GO

CREATE PROCEDURE SP_ListarBodegas
AS
BEGIN
    -- SET NOCOUNT ON: Evita que SQL Server retorne mensajes de "X filas afectadas"
    -- Esto mejora el performance y evita confusión en el cliente HTTP
    SET NOCOUNT ON;
    
    -- Seleccionamos solo los campos necesarios para la vista de lista
    SELECT 
        IDBODEGA,
        NOMBRE,
        DIRECCION,
        TELEFONOS,
        FAX,
        RESPONSABLE,
        VENDIBLE,
        ESTADO,
        FECHA_CREA,
        IDUSUARIO_CREA
    FROM 
        BODEGA
    WHERE 
        ESTADO = 'A'  -- Solo bodegas activas (Soft Delete)
    ORDER BY 
        NOMBRE ASC;   -- Orden alfabético para mejor UX
END
GO

-- =============================================
-- EJEMPLO DE USO:
-- EXEC SP_ListarBodegas
-- =============================================
