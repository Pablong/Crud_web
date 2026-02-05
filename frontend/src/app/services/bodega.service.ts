// =============================================
// Servicio: Bodegas
// =============================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bodega, BodegaRequest } from '../models/bodega.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BodegaService {
  private apiUrl = `${environment.apiUrl}/bodegas`;

  constructor(private http: HttpClient) {}

  listarBodegas(): Observable<ApiResponse<Bodega[]>> {
    return this.http.get<ApiResponse<Bodega[]>>(this.apiUrl);
  }

  obtenerBodegaPorId(id: string): Observable<ApiResponse<Bodega>> {
    return this.http.get<ApiResponse<Bodega>>(`${this.apiUrl}/${id}`);
  }

  crearBodega(bodega: BodegaRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, bodega);
  }

  actualizarBodega(id: string, bodega: BodegaRequest): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, bodega);
  }

  eliminarBodega(id: string, idUsuarioModi: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`, {
      body: { idUsuarioModi }
    });
  }
}
