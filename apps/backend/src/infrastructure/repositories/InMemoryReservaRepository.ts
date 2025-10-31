import { Reserva } from "../../../../../domain/src/index"
import { IRepositorioReservas } from "../../domain/repositories/IRepositorioReservas";

// Almacenamiento en memoria para las reservas
const reservas: Reserva[] = [];

export class InMemoryReservaRepository implements IRepositorioReservas {
    async guardar(reserva: Reserva): Promise<void> {
        const index = reservas.findIndex(r => r.id === reserva.id);
        if (index !== -1) {
            reservas[index] = reserva; // Actualiza si ya existe
        } else {
            reservas.push(reserva); // Agrega si es nueva
        }
        return Promise.resolve();
    }

    async obtener(id: string): Promise<Reserva | null> {
        const reserva = reservas.find(r => r.id === id);
        return Promise.resolve(reserva || null);
    }

    async obtenerPorHabitacionYFechas(habitacionId: string, desde: Date, hasta: Date): Promise<Reserva[]> {
        const reservasConflictivas = reservas.filter(reserva =>
            reserva.habitacionId === habitacionId &&
            reserva.estado !== 'Cancelada' &&
            ((reserva.fechaDesde < hasta && reserva.fechaHasta > desde))
        );
        return Promise.resolve(reservasConflictivas);
    }
}
