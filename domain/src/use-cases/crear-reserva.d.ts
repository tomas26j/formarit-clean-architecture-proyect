import { RepositorioReservas } from "../repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "../repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
import { ServicioCalculoPrecio } from "../services/precio-service.js";
export interface CrearReservaCommand {
    habitacionId: string;
    clienteId: string;
    checkIn: string;
    checkOut: string;
    numeroHuespedes: number;
    observaciones?: string;
}
export interface ReservaCreadaResponse {
    reservaId: string;
    estado: string;
    precioTotal: number;
    periodo: {
        checkIn: string;
        checkOut: string;
    };
    numeroHuespedes: number;
    observaciones?: string;
}
export declare class CrearReservaUseCase {
    private repositorioReservas;
    private repositorioHabitaciones;
    private servicioDisponibilidad;
    private servicioPrecios;
    constructor(repositorioReservas: RepositorioReservas, repositorioHabitaciones: RepositorioHabitaciones, servicioDisponibilidad: ServicioDisponibilidad, servicioPrecios: ServicioCalculoPrecio);
    execute(command: CrearReservaCommand): Promise<ReservaCreadaResponse>;
    private validarCommand;
    private generarId;
}
