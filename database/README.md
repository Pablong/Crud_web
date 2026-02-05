# 📁 Scripts SQL - Stored Procedures

Scripts SQL para la gestión de la tabla BODEGA.

## 🎯 Stored Procedures Incluidos

| # | Archivo | SP | Propósito |
|---|---------|----|-----------| 
| 1 | `01_SP_ListarBodegas.sql` | SP_ListarBodegas | Listar todas las bodegas activas |
| 2 | `02_SP_ObtenerBodegaPorID.sql` | SP_ObtenerBodegaPorID | Obtener una bodega específica |
| 3 | `03_SP_CrearBodega.sql` | SP_CrearBodega | Crear nueva bodega |
| 4 | `04_SP_ActualizarBodega.sql` | SP_ActualizarBodega | Actualizar bodega existente |
| 5 | `05_SP_EliminarBodega.sql` | SP_EliminarBodega | Eliminar bodega (soft delete) |

## 📝 Instrucciones de Instalación

### Opción 1: SQL Server Management Studio (SSMS)

1. Abre **SQL Server Management Studio**
2. Conecta con tu servidor SQL Server
3. Abre cada archivo `.sql` en orden (01, 02, 03, 04, 05)
4. Selecciona la base de datos correcta (dropdown superior o `USE NombreBD`)
5. Ejecuta cada script: **F5** o botón "Execute"
6. Verifica que aparezca: `Command(s) completed successfully.`

### Opción 2: sqlcmd (Línea de comandos)

```bash
sqlcmd -S servidor -d basedatos -U usuario -P contraseña -i 01_SP_ListarBodegas.sql
sqlcmd -S servidor -d basedatos -U usuario -P contraseña -i 02_SP_ObtenerBodegaPorID.sql
sqlcmd -S servidor -d basedatos -U usuario -P contraseña -i 03_SP_CrearBodega.sql
sqlcmd -S servidor -d basedatos -U usuario -P contraseña -i 04_SP_ActualizarBodega.sql
sqlcmd -S servidor -d basedatos -U usuario -P contraseña -i 05_SP_EliminarBodega.sql
```

## ✅ Verificar Instalación

Ejecuta este query en SSMS para verificar que los SPs se crearon:

```sql
SELECT 
    name AS StoredProcedure,
    create_date AS FechaCreacion,
    modify_date AS UltimaModificacion
FROM 
    sys.procedures
WHERE 
    name LIKE 'SP_%Bodega%'
ORDER BY 
    name;
```

Deberías ver 5 SPs listados.

## 🧪 Pruebas Rápidas

### Insertar bodega de prueba:

```sql
EXEC SP_CrearBodega 
    @IdBodega = 'TEST1',
    @Nombre = 'Bodega de Prueba',
    @Direccion = 'Calle Falsa 123',
    @Telefonos = '555-0000',
    @Fax = '555-0001',
    @Responsable = 'Juan Test',
    @IdUsuarioCrea = 'ADMIN',
    @Tipo = 'P',
    @SerieDocumentos = 'A',
    @Vendible = 'S'
```

### Listar bodegas:

```sql
EXEC SP_ListarBodegas
```

### Obtener bodega específica:

```sql
EXEC SP_ObtenerBodegaPorID 'TEST1'
```

### Actualizar bodega:

```sql
EXEC SP_ActualizarBodega
    @IdBodega = 'TEST1',
    @Nombre = 'Bodega Actualizada',
    @Direccion = 'Nueva Dirección',
    @Telefonos = '555-9999',
    @Fax = '555-9998',
    @Responsable = 'María Test',
    @IdUsuarioModi = 'ADMIN',
    @Tipo = 'P',
    @SerieDocumentos = 'B',
    @Vendible = 'N',
    @Estado = 'A'
```

### Eliminar bodega (soft delete):

```sql
EXEC SP_EliminarBodega 'TEST1', 'ADMIN'
```

### Verificar que se inactivó:

```sql
-- No debería aparecer (solo muestra activas)
EXEC SP_ListarBodegas

-- Verificar directamente en la tabla
SELECT IDBODEGA, NOMBRE, ESTADO FROM BODEGA WHERE IDBODEGA = 'TEST1'
-- Debería mostrar ESTADO = 'I'
```

## 📚 Conceptos Implementados

- ✅ **Validaciones de negocio** (longitud, existencia, valores permitidos)
- ✅ **Transacciones** (BEGIN/COMMIT/ROLLBACK)
- ✅ **Manejo de errores** (TRY-CATCH)
- ✅ **Auditoría** (IDUSUARIO_CREA, FECHA_CREA, IDUSUARIO_MODI, FECHA_MODI)
- ✅ **Soft Delete** (cambio de estado, no borrado físico)
- ✅ **SET NOCOUNT ON** (mejor performance)

## ⚠️ Notas Importantes

1. **IDBODEGA** tiene un límite de **5 caracteres** (nvarchar(5))
2. **ESTADO**: `'A'` = Activo, `'I'` = Inactivo
3. **VENDIBLE**: `'S'` = Sí, `'N'` = No
4. **Soft Delete**: Los registros no se borran físicamente
5. **Auditoría**: Los campos `*_CREA` nunca se modifican después de creados
