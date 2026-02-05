// =============================================
// Modelo: Bodega
// =============================================

export interface Bodega {
  IDBODEGA: string;
  NOMBRE: string;
  DIRECCION: string;
  TELEFONOS: string;
  FAX: string;
  RESPONSABLE: string;
  VENDIBLE: string;
  ESTADO: string;
  TIPO?: string;
  SERIE_DOCUMENTOS?: string;
  IDUSUARIO_CREA?: string;
  FECHA_CREA?: Date;
  IDUSUARIO_MODI?: string;
  FECHA_MODI?: Date;
}

// Para crear/actualizar (camelCase para backend)
export interface BodegaRequest {
  idBodega: string;
  nombre: string;
  direccion: string;
  telefonos: string;
  fax: string;
  responsable: string;
  tipo: string;
  serieDocumentos: string;
  vendible: string;
  estado?: string;
  idUsuarioCrea?: string;
  idUsuarioModi?: string;
}
