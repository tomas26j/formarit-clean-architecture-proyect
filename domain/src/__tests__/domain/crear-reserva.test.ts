/**
 * Tests para el caso de uso Crear Reserva
 * Demuestra cómo testear con la nueva arquitectura Clean Architecture
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { crearReserva } from '../../domain/use-cases/crear-reserva.js';
import { CrearReservaDTO } from '../../application/dtos/reserva-dto.js';
import { CrearReservaDependencies } from '../../domain/use-cases/crear-reserva.js';
import { Result } from '../../shared/types/result.js';
import { ValidationError, DomainError } from '../../shared/types/domain-errors.js';
import { EstadoReserva } from '../../domain/entities/reserva.js';

// Mocks para las dependencias
const mockReservaService = {
  validarCreacionReserva: vi.fn(),
  validarConfirmacionReserva: vi.fn(),
  validarCancelacionReserva: vi.fn(),
  validarCheckIn: vi.fn(),
  validarCheckOut: vi.fn(),
  calcularPenalizacionCancelacion: vi.fn(),
  puedeModificarse: vi.fn(),
  crearReserva: vi.fn(),
  confirmarReserva: vi.fn(),
  cancelarReserva: vi.fn(),
  realizarCheckIn: vi.fn(),
  realizarCheckOut: vi.fn()
};

const mockReservaValidator = {
  validarCrearReserva: vi.fn(),
  validarActualizarReserva: vi.fn(),
  validarCancelarReserva: vi.fn(),
  validarIdReserva: vi.fn(),
  validarFechas: vi.fn(),
  validarNumeroHuespedes: vi.fn()
};

const mockReservaMapper = {
  dtoToEntity: vi.fn(),
  entityToDto: vi.fn(),
  entityToSchema: vi.fn(),
  schemaToEntity: vi.fn(),
  updateDtoToPartialEntity: vi.fn()
};

const mockRepositorioReservas = {
  guardar: vi.fn(),
  buscarPorId: vi.fn(),
  buscarPorCliente: vi.fn(),
  buscarPorHabitacion: vi.fn(),
  buscarPorEstado: vi.fn(),
  buscarPorRangoFechas: vi.fn(),
  existe: vi.fn(),
  eliminar: vi.fn(),
  listar: vi.fn()
};

const mockRepositorioHabitaciones = {
  guardar: vi.fn(),
  buscarPorId: vi.fn(),
  buscarPorNumero: vi.fn(),
  buscarPorTipo: vi.fn(),
  buscarActivas: vi.fn(),
  buscarPorPiso: vi.fn(),
  existe: vi.fn(),
  existePorNumero: vi.fn(),
  eliminar: vi.fn(),
  listar: vi.fn()
};

const mockServicioDisponibilidad = {
  verificarDisponibilidad: vi.fn(),
  verificarDisponibilidadMultiple: vi.fn(),
  buscarHabitacionesDisponibles: vi.fn(),
  verificarConflictosReservas: vi.fn()
};

const mockServicioPrecios = {
  calcularPrecio: vi.fn(),
  calcularPrecioConDescuento: vi.fn(),
  calcularPrecioConImpuestos: vi.fn(),
  calcularPrecioPorNoche: vi.fn(),
  aplicarDescuentoEstacional: vi.fn(),
  calcularPenalizacionCancelacion: vi.fn()
};

const mockGenerarId = vi.fn(() => 'reserva_123');

describe('Crear Reserva Use Case', () => {
  let dependencies: CrearReservaDependencies;
  let command: CrearReservaDTO;

  beforeEach(() => {
    // Resetear todos los mocks
    vi.clearAllMocks();

    // Configurar dependencias
    dependencies = {
      reservaService: mockReservaService,
      reservaValidator: mockReservaValidator,
      reservaMapper: mockReservaMapper,
      repositorioReservas: mockRepositorioReservas,
      repositorioHabitaciones: mockRepositorioHabitaciones,
      servicioDisponibilidad: mockServicioDisponibilidad,
      servicioPrecios: mockServicioPrecios,
      generarId: mockGenerarId
    };

    // Comando de prueba
    command = {
      habitacionId: 'habitacion_123',
      clienteId: 'cliente_456',
      checkIn: '2024-02-01T15:00:00Z',
      checkOut: '2024-02-03T11:00:00Z',
      numeroHuespedes: 2,
      observaciones: 'Habitación con vista al mar'
    };
  });

  it('debería crear una reserva exitosamente', async () => {
    // Arrange
    const habitacionMock = {
      id: 'habitacion_123',
      numero: '101',
      tipo: { capacidad: 4 },
      puedeReservarse: () => true
    };

    const reservaMock = {
      id: 'reserva_123',
      habitacionId: 'habitacion_123',
      clienteId: 'cliente_456',
      periodo: {
        checkIn: new Date('2024-02-01T15:00:00Z'),
        checkOut: new Date('2024-02-03T11:00:00Z')
      },
      estado: EstadoReserva.PENDIENTE,
      precioTotal: { valor: 200, moneda: 'USD' },
      numeroHuespedes: 2,
      observaciones: 'Habitación con vista al mar',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    const precioMock = { valor: 200, moneda: 'USD' };

    // Configurar mocks para éxito
    mockReservaValidator.validarCrearReserva.mockReturnValue(Result.success(true));
    mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(Result.success(habitacionMock));
    mockServicioDisponibilidad.verificarDisponibilidad.mockResolvedValue(Result.success(true));
    mockServicioPrecios.calcularPrecio.mockReturnValue(Result.success(precioMock));
    mockReservaMapper.dtoToEntity.mockReturnValue(Result.success(reservaMock));
    mockReservaService.validarCreacionReserva.mockReturnValue(Result.success(true));
    mockRepositorioReservas.guardar.mockResolvedValue(Result.success(reservaMock));
    mockReservaMapper.entityToDto.mockReturnValue({
      id: 'reserva_123',
      habitacionId: 'habitacion_123',
      clienteId: 'cliente_456',
      checkIn: '2024-02-01T15:00:00Z',
      checkOut: '2024-02-03T11:00:00Z',
      estado: EstadoReserva.PENDIENTE,
      precioTotal: 200,
      numeroHuespedes: 2,
      observaciones: 'Habitación con vista al mar',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    });

    // Act
    const result = await crearReserva(command, dependencies);

    // Assert
    expect(result.isSuccess()).toBe(true);
    if (result.isSuccess()) {
      expect(result.data.id).toBe('reserva_123');
      expect(result.data.estado).toBe(EstadoReserva.PENDIENTE);
      expect(result.data.precioTotal).toBe(200);
    }

    // Verificar que se llamaron los métodos correctos
    expect(mockReservaValidator.validarCrearReserva).toHaveBeenCalledWith(command);
    expect(mockRepositorioHabitaciones.buscarPorId).toHaveBeenCalledWith('habitacion_123');
    expect(mockServicioDisponibilidad.verificarDisponibilidad).toHaveBeenCalled();
    expect(mockServicioPrecios.calcularPrecio).toHaveBeenCalled();
    expect(mockRepositorioReservas.guardar).toHaveBeenCalledWith(reservaMock);
  });

  it('debería fallar si los datos de entrada son inválidos', async () => {
    // Arrange
    const validationError = new ValidationError('Datos inválidos');
    mockReservaValidator.validarCrearReserva.mockReturnValue(Result.failure(validationError));

    // Act
    const result = await crearReserva(command, dependencies);

    // Assert
    expect(result.isFailure()).toBe(true);
    if (result.isFailure()) {
      expect(result.error).toBe(validationError);
    }

    // Verificar que no se llamaron otros métodos después del error de validación
    expect(mockRepositorioHabitaciones.buscarPorId).not.toHaveBeenCalled();
    expect(mockServicioDisponibilidad.verificarDisponibilidad).not.toHaveBeenCalled();
  });

  it('debería fallar si la habitación no existe', async () => {
    // Arrange
    mockReservaValidator.validarCrearReserva.mockReturnValue(Result.success(true));
    mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(Result.success(null));

    // Act
    const result = await crearReserva(command, dependencies);

    // Assert
    expect(result.isFailure()).toBe(true);
    if (result.isFailure()) {
      expect(result.error.message).toBe('Habitación no encontrada');
    }
  });

  it('debería fallar si la habitación no está disponible', async () => {
    // Arrange
    const habitacionMock = {
      id: 'habitacion_123',
      numero: '101',
      tipo: { capacidad: 4 },
      puedeReservarse: () => false
    };

    mockReservaValidator.validarCrearReserva.mockReturnValue(Result.success(true));
    mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(Result.success(habitacionMock));

    // Act
    const result = await crearReserva(command, dependencies);

    // Assert
    expect(result.isFailure()).toBe(true);
    if (result.isFailure()) {
      expect(result.error.message).toBe('La habitación no está disponible para reservas');
    }
  });

  it('debería fallar si la habitación no está disponible para las fechas', async () => {
    // Arrange
    const habitacionMock = {
      id: 'habitacion_123',
      numero: '101',
      tipo: { capacidad: 4 },
      puedeReservarse: () => true
    };

    mockReservaValidator.validarCrearReserva.mockReturnValue(Result.success(true));
    mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(Result.success(habitacionMock));
    mockServicioDisponibilidad.verificarDisponibilidad.mockResolvedValue(Result.success(false));

    // Act
    const result = await crearReserva(command, dependencies);

    // Assert
    expect(result.isFailure()).toBe(true);
    if (result.isFailure()) {
      expect(result.error.message).toBe('Habitación no disponible para las fechas solicitadas');
    }
  });

  it('debería fallar si se excede la capacidad de la habitación', async () => {
    // Arrange
    const habitacionMock = {
      id: 'habitacion_123',
      numero: '101',
      tipo: { capacidad: 1 }, // Capacidad menor al número de huéspedes
      puedeReservarse: () => true
    };

    const commandConMuchosHuespedes = {
      ...command,
      numeroHuespedes: 3
    };

    mockReservaValidator.validarCrearReserva.mockReturnValue(Result.success(true));
    mockRepositorioHabitaciones.buscarPorId.mockResolvedValue(Result.success(habitacionMock));
    mockServicioDisponibilidad.verificarDisponibilidad.mockResolvedValue(Result.success(true));

    // Act
    const result = await crearReserva(commandConMuchosHuespedes, dependencies);

    // Assert
    expect(result.isFailure()).toBe(true);
    if (result.isFailure()) {
      expect(result.error.message).toBe('La habitación solo puede alojar 1 huéspedes');
    }
  });
});
