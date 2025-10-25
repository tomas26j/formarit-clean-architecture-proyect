/**
 * Schema de persistencia para la entidad Reserva
 * Define la estructura de datos para almacenamiento en base de datos
 */

import { EstadoReserva } from "../entities/reserva";

export interface ReservaSchema {
  id: string;
  habitacion_id: string;
  cliente_id: string;
  check_in: string; // ISO date string
  check_out: string; // ISO date string
  estado: EstadoReserva;
  precio_total: number;
  numero_huespedes: number;
  observaciones?: string;
  motivo_cancelacion?: string;
  fecha_creacion: string; // ISO date string
  fecha_actualizacion: string; // ISO date string
}

export interface ReservaCreateSchema {
  id: string;
  habitacion_id: string;
  cliente_id: string;
  check_in: string;
  check_out: string;
  estado: EstadoReserva;
  precio_total: number;
  numero_huespedes: number;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface ReservaUpdateSchema {
  estado?: EstadoReserva;
  observaciones?: string;
  motivo_cancelacion?: string;
  fecha_actualizacion: string;
}
