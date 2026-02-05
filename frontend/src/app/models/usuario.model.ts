// =============================================
// Modelo: Usuario
// =============================================

export interface Usuario {
  IDUSUARIO: string;
  NOMBRE: string;
  EMAIL: string;
  ULTIMO_LOGIN?: Date;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: Usuario;
  message: string;
}
