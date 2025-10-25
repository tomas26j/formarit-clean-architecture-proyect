/**
 * Schema de persistencia para la entidad Usuario
 */

import { RolUsuario } from "../entities/usuario.js";

export interface UsuarioSchema {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  cliente_id?: string;
  telefono?: string;
  fecha_creacion: string; // ISO date string
  fecha_actualizacion: string; // ISO date string
}

export interface UsuarioCreateSchema {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  cliente_id?: string;
  telefono?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface UsuarioUpdateSchema {
  nombre?: string;
  email?: string;
  rol?: RolUsuario;
  activo?: boolean;
  cliente_id?: string;
  telefono?: string;
  fecha_actualizacion: string;
}
