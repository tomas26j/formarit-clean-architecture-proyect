import { RepositorioHabitaciones } from "../repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
export interface ConsultarDisponibilidadCommand {
    checkIn: string;
    checkOut: string;
    tipoHabitacion?: string;
    capacidadMinima?: number;
    precioMaximo?: number;
}
export interface HabitacionDisponibleResponse {
    id: string;
    numero: string;
    tipo: string;
    capacidad: number;
    precioBase: number;
    precioTotal: number;
    piso: number;
    vista: string;
    amenidades: string[];
}
export interface DisponibilidadResponse {
    habitaciones: HabitacionDisponibleResponse[];
    totalDisponibles: number;
    periodo: {
        checkIn: string;
        checkOut: string;
        duracionNoches: number;
    };
}
export declare class ConsultarDisponibilidadUseCase {
    private repositorioHabitaciones;
    private servicioDisponibilidad;
    constructor(repositorioHabitaciones: RepositorioHabitaciones, servicioDisponibilidad: ServicioDisponibilidad);
    execute(command: ConsultarDisponibilidadCommand): Promise<DisponibilidadResponse>;
    private validarCommand;
    private obtenerTipoHabitacion;
    private aplicarFiltros;
    private mapearHabitacionARespuesta;
}
