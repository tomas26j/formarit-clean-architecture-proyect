import { RepositorioReservas } from "../repositories/reserva-repository.js";
import { RepositorioHabitaciones } from "../repositories/habitacion-repository.js";
import { ServicioDisponibilidad } from "../services/disponibilidad-service.js";
export interface ConfirmarReservaCommand {
    reservaId: string;
    metodoPago: string;
    numeroTarjeta?: string;
    codigoSeguridad?: string;
    fechaVencimiento?: string;
}
export interface ReservaConfirmadaResponse {
    reservaId: string;
    estado: string;
    confirmadaEn: string;
    metodoPago: string;
    precioTotal: number;
    periodo: {
        checkIn: string;
        checkOut: string;
    };
}
export declare class ConfirmarReservaUseCase {
    private repositorioReservas;
    private repositorioHabitaciones;
    private servicioDisponibilidad;
    constructor(repositorioReservas: RepositorioReservas, repositorioHabitaciones: RepositorioHabitaciones, servicioDisponibilidad: ServicioDisponibilidad);
    execute(command: ConfirmarReservaCommand): Promise<ReservaConfirmadaResponse>;
    private validarCommand;
    private validarMetodoPago;
}
