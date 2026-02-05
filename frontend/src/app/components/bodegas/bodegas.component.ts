// =============================================
// Componente: Bodegas (Dashboard)
// =============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BodegaService } from '../../services/bodega.service';
import { AuthService } from '../../services/auth.service';
import { Bodega, BodegaRequest } from '../../models/bodega.model';

@Component({
  selector: 'app-bodegas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.css']
})
export class BodegasComponent implements OnInit {
  bodegas: Bodega[] = [];
  bodegasFiltradas: Bodega[] = [];
  searchTerm = '';
  mostrarInactivos = false;
  isLoading = false;
  errorMessage = '';

  // Modal
  showModal = false;
  isEditMode = false;
  bodegaActual: Partial<Bodega> = {};

  constructor(
    private bodegaService: BodegaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarBodegas();
  }

  cargarBodegas(): void {
    this.isLoading = true;
    this.bodegaService.listarBodegas().subscribe({
      next: (response) => {
        this.bodegas = response.data;
        this.filtrarBodegas();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar bodegas';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  filtrarBodegas(): void {
    let resultado = this.bodegas;

    // Filtrar por estado
    if (!this.mostrarInactivos) {
      resultado = resultado.filter(b => b.ESTADO === 'A');
    }

    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(b => 
        b.IDBODEGA.toLowerCase().includes(term) ||
        b.NOMBRE.toLowerCase().includes(term)
      );
    }

    this.bodegasFiltradas = resultado;
  }

  onSearchChange(): void {
    this.filtrarBodegas();
  }

  onToggleInactivos(): void {
    this.filtrarBodegas();
  }

  buscar(): void {
    this.filtrarBodegas();
  }

  abrirModalNueva(): void {
    this.isEditMode = false;
    this.bodegaActual = {
      ESTADO: 'A',
      VENDIBLE: 'S',
      TIPO: 'P'
    };
    this.showModal = true;
  }

  abrirModalEditar(bodega: Bodega): void {
    this.isEditMode = true;
    this.bodegaActual = { ...bodega };
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.bodegaActual = {};
  }

  guardarBodega(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    const bodegaRequest: BodegaRequest = {
      idBodega: this.bodegaActual.IDBODEGA || '',
      nombre: this.bodegaActual.NOMBRE || '',
      direccion: this.bodegaActual.DIRECCION || '',
      telefonos: this.bodegaActual.TELEFONOS || '',
      fax: this.bodegaActual.FAX || '',
      responsable: this.bodegaActual.RESPONSABLE || '',
      tipo: this.bodegaActual.TIPO || 'P',
      serieDocumentos: this.bodegaActual.SERIE_DOCUMENTOS || '',
      vendible: this.bodegaActual.VENDIBLE || 'S',
      estado: this.bodegaActual.ESTADO || 'A'
    };

    if (this.isEditMode) {
      bodegaRequest.idUsuarioModi = usuario.IDUSUARIO;
      this.bodegaService.actualizarBodega(this.bodegaActual.IDBODEGA!, bodegaRequest).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarBodegas();
        },
        error: (error) => {
          alert('Error al actualizar: ' + (error.error?.message || error.message));
        }
      });
    } else {
      bodegaRequest.idUsuarioCrea = usuario.IDUSUARIO;
      this.bodegaService.crearBodega(bodegaRequest).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarBodegas();
        },
        error: (error) => {
          alert('Error al crear: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  eliminarBodega(bodega: Bodega): void {
    if (!confirm(`¿Está seguro de eliminar la bodega ${bodega.NOMBRE}?`)) {
      return;
    }

    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.bodegaService.eliminarBodega(bodega.IDBODEGA, usuario.IDUSUARIO).subscribe({
      next: () => {
        this.cargarBodegas();
      },
      error: (error) => {
        alert('Error al eliminar: ' + (error.error?.message || error.message));
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
