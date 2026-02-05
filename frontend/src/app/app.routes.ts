// =============================================
// Configuración de Rutas
// =============================================

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BodegasComponent } from './components/bodegas/bodegas.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'bodegas', 
    component: BodegasComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
