import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrearReservaUseCase, CrearReservaCommand } from '../../use-cases/crear-reserva.js';
import { RepositorioReservas } from '../../repositories/reserva-repository.js';
import { RepositorioHabitaciones } from '../../repositories/habitacion-repository.js';
import { ServicioDisponibilidad } from '../../services/disponibilidad-service.js';
import { ServicioCalculoPrecio } from '../../services/precio-service.js';
import { HabitacionImpl } from '../../entities/room.js';
import { TipoHabitacionImpl } from '../../utils/types/room-type.js';
import { PrecioImpl } from '../../utils/types/precio.js';

describe('CrearReservaUseCase', () => {
  let useCase: CrearReservaUseCase;
  let mockRepositorioReservas: jest.Mocked<RepositorioReservas>;
  let mockRepositorioHabitaciones: jest.Mocked<RepositorioHabitaciones>;
  let mockServicioDisponibilidad: jest.Mocked<ServicioDisponibilidad>;
  let mockServicioPrecios: jest.Mocked<ServicioCalculoPrecio>;

  beforeEach(() => {
    // Crear mocks
    mockRepositorioReservas = {
      guardar: vi.fn(),
      buscarPorId: vi.fn(),
      eliminar: vi.fn(),
      buscarPorCliente: vi.fn(),
      buscarPorHabitacion: vi.fn(),
      buscarPorHabitacionYPeriodo: vi.fn(),
      buscarPorEstado: vi.fn(),
      buscarPorPeriodo: vi.fn(),
      buscarReservasActivas: vi.fn(),
      buscarReservasPendientes: vi.fn(),
      buscarReservasPorConfirmar: vi.fn(),
      buscarReservasVencidas: vi.fn(),
      contarReservasPorCliente: vi.fn(),
      contarReservasPorHabitacion: vi.fn(),
      verificarExistencia: vi.fn(),
      actualizarEstado: vi.fn(),
      cancelarReservasVencidas: vi.fn()
    };

    mockRepositorioHabitaciones = {
      guardar: vi.fn(),
      buscarPorId: vi.fn(),
      eliminar: vi.fn(),
      buscarPorNumero: vi.fn(),
      buscarPorTipo: vi.fn(),
      buscarPorPiso: vi.fn(),
      buscarActivas: vi.fn(),
      buscarInactivas: vi.fn(),
      buscarDisponibles: vi.fn(),
      buscarDisponiblesPorTipo: vi.fn(),
      buscarDisponiblesPorCapacidad: vi.fn(),
      contarHabitaciones: vi.fn(),
      contarHabitacionesPorTipo: vi.fn(),
      contarHabitacionesActivas: vi.fn(),
      verificarExistencia: vi.fn(),
      verificarNumeroDisponible: vi.fn(),
      activarHabitacion: vi.fn(),
      desactivarHabitacion: vi.fn(),
      actualizarPrecio: vi.fn(),
      buscarHabitacionesConOcupacion: vi.fn(),
      buscarHabitacionesPorRangoPrecio: vi.fn()
    };

    mockServicioDisponibilidad = {
      verificarDisponibilidad: vi.fn(),
      buscarHabitacionesDisponibles: vi.fn(),
      verificarDisponibilidadConReservas: vi.fn(),
      calcularTiempoLimpieza: vi.fn(),
      verificarDisponibilidadConLimpieza: vi.fn()
    };

    mockServicioPrecios = {
      calcularPrecio: vi.fn(),
      calcularPrecioConDescuento: vi.fn(),
      calcularPrecioTemporada: vi.fn(),
      calcularPrecioGrupo: vi.fn()
    };

    useCase = new CrearReservaUseCase(
      mockRepositorioReservas,
      mockRepositorioHabitaciones,
      mockServicioDisponibilidad,
      mockServicioPrecios
    );
  });

  describe('execute', () => {
    const command: CrearReservaCommand = {
      habitacionId: 'habitacion-123',
      clienteId: 'cliente-456',
      checkIn: '2024-01-15',
      checkOut: '2024-01-20',
      numeroHuespedes: 2,
      observaciones: 'Habitación con vista al mar'
    };

    const habitacionMock = HabitacionImpl.crear(
      'habitacion-123',
      '201',
      TipoHabitacionImpl.doble(),
      PrecioImpl.crear(150)
    );

    it('debería crear una reserva exitosamente', async () => {
      // Arrange
      mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(habitacionMock);
      mockServicioDisponibilidad.verificarDisponibilidad.mockResolvedValue(true);
      mockServicioPrecios.calcularPrecio.mockReturnValue(PrecioImpl.crear(750));
      mockRepositorioReservas.guardar.mockResolvedValue();

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.reservaId).toBeDefined();
      expect(result.estado).toBe('pendiente');
      expect(result.precioTotal).toBe(750);
      expect(result.numeroHuespedes).toBe(2);
      expect(result.observaciones).toBe('Habitación con vista al mar');
      expect(mockRepositorioReservas.guardar).toHaveBeenCalledTimes(1);
    });

    it('debería fallar si la habitación no existe', async () => {
      // Arrange
      mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('Habitación no encontrada');
    });

    it('debería fallar si la habitación no está disponible', async () => {
      // Arrange
      mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(habitacionMock);
      mockServicioDisponibilidad.verificarDisponibilidad.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('Habitación no disponible para las fechas solicitadas');
    });

    it('debería fallar si el número de huéspedes excede la capacidad', async () => {
      // Arrange
      const commandConMuchosHuespedes = { ...command, numeroHuespedes: 5 };
      mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(habitacionMock);

      // Act & Assert
      await expect(useCase.execute(commandConMuchosHuespedes)).rejects.toThrow('La habitación solo puede alojar 2 huéspedes');
    });

    it('debería fallar si faltan datos requeridos', async () => {
      // Arrange
      const commandInvalido = { ...command, habitacionId: '' };

      // Act & Assert
      await expect(useCase.execute(commandInvalido)).rejects.toThrow('El ID de habitación es requerido');
    });

    it('debería fallar si las fechas son inválidas', async () => {
      // Arrange
      const commandConFechasInvalidas = { ...command, checkIn: 'fecha-invalida' };

      // Act & Assert
      await expect(useCase.execute(commandConFechasInvalidas)).rejects.toThrow('Las fechas deben tener un formato válido');
    });

    it('debería fallar si el número de huéspedes es inválido', async () => {
      // Arrange
      const commandConHuespedesInvalidos = { ...command, numeroHuespedes: 0 };

      // Act & Assert
      await expect(useCase.execute(commandConHuespedesInvalidos)).rejects.toThrow('El número de huéspedes debe ser mayor a 0');
    });
  });
});
