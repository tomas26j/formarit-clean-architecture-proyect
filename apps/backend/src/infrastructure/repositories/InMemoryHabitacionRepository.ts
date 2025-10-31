//import { Habitacion } from "../../../../../domain/src/domain/entities/habitacion";
import { Habitacion } from "../../../../../domain/src/domain/entities/habitacion";
import { RepositorioHabitaciones } from "../../../../../domain/src/infrastructure/repositories/habitacion-repository";

// Datos de ejemplo en memoria
const habitaciones: Habitacion[] = [
    Habitacion("101", "Habitación Estándar", 100),
    Habitacion("102", "Habitación Estándar", 100),
    Habitacion("201", "Habitación Deluxe", 150),
    Habitacion("301", "Suite Presidencial", 300),
];

export class InMemoryHabitacionRepository implements RepositorioHabitaciones {
    async obtenerTodas(): Promise<Habitacion[]> {
        return Promise.resolve(habitaciones);
    }

    async obtener(id: string): Promise<Habitacion | null> {
        const habitacion = habitaciones.find(h => h.id === id);
        return Promise.resolve(habitacion || null);
    }
}
