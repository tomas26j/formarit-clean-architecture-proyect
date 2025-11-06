/**
 * Schema de persistencia para la entidad Habitación
 */
export interface HabitacionSchema {
    id: string;
    numero: string;
    tipo_id: string;
    precio_base: number;
    activa: boolean;
    piso: number;
    vista: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
}
export interface HabitacionCreateSchema {
    id: string;
    numero: string;
    tipo_id: string;
    precio_base: number;
    activa: boolean;
    piso: number;
    vista: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
}
export interface HabitacionUpdateSchema {
    precio_base?: number;
    activa?: boolean;
    vista?: string;
    fecha_actualizacion: string;
}
