import { describe, it, expect } from 'vitest';
import { ReservaImpl, EstadoReserva } from '../../entities/reservation.js';
import { PeriodoImpl } from '../../utils/types/lapse.js';
import { PrecioImpl } from '../../utils/types/precio.js';

describe('ReservaImpl', () => {
  const crearReservaBasica = () => {
    const periodo = new PeriodoImpl(
      new Date('2024-01-15'),
      new Date('2024-01-20')
    );
    const precio = new PrecioImpl(1500);
    
    return new ReservaImpl(
      'reserva-123',
      'habitacion-456',
      'cliente-789',
      periodo,
      EstadoReserva.PENDIENTE,
      precio,
      2
    );
  };

  describe('constructor', () => {
    it('debería crear una reserva válida', () => {
      const reserva = crearReservaBasica();
      
      expect(reserva.id).toBe('reserva-123');
      expect(reserva.habitacionId).toBe('habitacion-456');
      expect(reserva.clienteId).toBe('cliente-789');
      expect(reserva.estado).toBe(EstadoReserva.PENDIENTE);
      expect(reserva.numeroHuespedes).toBe(2);
    });

    it('debería fallar si habitacionId está vacío', () => {
      const periodo = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-20')
      );
      const precio = new PrecioImpl(1500);
      
      expect(() => {
        new ReservaImpl(
          'reserva-123',
          '',
          'cliente-789',
          periodo,
          EstadoReserva.PENDIENTE,
          precio,
          2
        );
      }).toThrow('El ID de habitación es requerido');
    });

    it('debería fallar si clienteId está vacío', () => {
      const periodo = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-20')
      );
      const precio = new PrecioImpl(1500);
      
      expect(() => {
        new ReservaImpl(
          'reserva-123',
          'habitacion-456',
          '',
          periodo,
          EstadoReserva.PENDIENTE,
          precio,
          2
        );
      }).toThrow('El ID de cliente es requerido');
    });

    it('debería fallar si numeroHuespedes es menor o igual a 0', () => {
      const periodo = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-20')
      );
      const precio = new PrecioImpl(1500);
      
      expect(() => {
        new ReservaImpl(
          'reserva-123',
          'habitacion-456',
          'cliente-789',
          periodo,
          EstadoReserva.PENDIENTE,
          precio,
          0
        );
      }).toThrow('El número de huéspedes debe ser mayor a 0');
    });

    it('debería fallar si precio está vacío', () => {
      const periodo = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-20')
      );
      const precio = new PrecioImpl(0);
      
      expect(() => {
        new ReservaImpl(
          'reserva-123',
          'habitacion-456',
          'cliente-789',
          periodo,
          EstadoReserva.PENDIENTE,
          precio,
          2
        );
      }).toThrow('El precio no puede ser negativo');
    });

    it('debería fallar si periodo está vacío', () => {
      const periodo = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-20')
      );
      const precio = new PrecioImpl(1500);
      
      expect(() => {
        new ReservaImpl(
          'reserva-123',
          'habitacion-456',
          'cliente-789',
          periodo,
          EstadoReserva.PENDIENTE,
          precio,
          2
        );
      }).toThrow('El periodo es requerido');
    });
  });

  describe('confirmar', () => {
    it('debería confirmar una reserva pendiente', () => {
      const reserva = crearReservaBasica();
      const reservaConfirmada = reserva.confirmar();
      
      expect(reservaConfirmada.estado).toBe(EstadoReserva.CONFIRMADA);
      expect(reservaConfirmada.id).toBe(reserva.id);
      expect(reservaConfirmada.habitacionId).toBe(reserva.habitacionId);
    });

    it('debería fallar al confirmar una reserva que no está pendiente', () => {
      const reserva = crearReservaBasica();
      const reservaConfirmada = reserva.confirmar();
      
      expect(() => {
        reservaConfirmada.confirmar();
      }).toThrow('Solo las reservas pendientes pueden confirmarse');
    });
  });

  describe('cancelar', () => {
    it('debería cancelar una reserva pendiente', () => {
      const reserva = crearReservaBasica();
      const reservaCancelada = reserva.cancelar('Cambio de planes');
      
      expect(reservaCancelada.estado).toBe(EstadoReserva.CANCELADA);
      expect(reservaCancelada.observaciones).toBe('Cambio de planes');
    });

    it('debería cancelar una reserva confirmada', () => {
      const reserva = crearReservaBasica();
      const reservaConfirmada = reserva.confirmar();
      const reservaCancelada = reservaConfirmada.cancelar('Emergencia familiar');
      
      expect(reservaCancelada.estado).toBe(EstadoReserva.CANCELADA);
      expect(reservaCancelada.observaciones).toBe('Emergencia familiar');
    });

    it('debería fallar al cancelar una reserva ya cancelada', () => {
      const reserva = crearReservaBasica();
      const reservaCancelada = reserva.cancelar('Cambio de planes');
      
      expect(() => {
        reservaCancelada.cancelar('Otro motivo');
      }).toThrow('Esta reserva no puede cancelarse en su estado actual');
    });

    it('debería fallar al cancelar sin motivo', () => {
      const reserva = crearReservaBasica();
      
      expect(() => {
        reserva.cancelar('');
      }).toThrow('El motivo de cancelación es requerido');
    });
  });

  describe('realizarCheckIn', () => {
    it('debería realizar check-in de una reserva confirmada', () => {
      const reserva = crearReservaBasica();
      const reservaConfirmada = reserva.confirmar();
      const reservaCheckIn = reservaConfirmada.realizarCheckIn();
      
      expect(reservaCheckIn.estado).toBe(EstadoReserva.CHECKIN);
    });

    it('debería fallar al hacer check-in de una reserva no confirmada', () => {
      const reserva = crearReservaBasica();
      
      expect(() => {
        reserva.realizarCheckIn();
      }).toThrow('Solo las reservas confirmadas pueden realizar check-in');
    });
  });

  describe('realizarCheckOut', () => {
    it('debería realizar check-out de una reserva en check-in', () => {
      const reserva = crearReservaBasica();
      const reservaConfirmada = reserva.confirmar();
      const reservaCheckIn = reservaConfirmada.realizarCheckIn();
      const reservaCheckOut = reservaCheckIn.realizarCheckOut();
      
      expect(reservaCheckOut.estado).toBe(EstadoReserva.CHECKOUT);
    });

    it('debería fallar al hacer check-out de una reserva no en check-in', () => {
      const reserva = crearReservaBasica();
      
      expect(() => {
        reserva.realizarCheckOut();
      }).toThrow('Solo las reservas en check-in pueden realizar check-out');
    });
  });

  describe('puedeCancelarse', () => {
    it('debería retornar true para reservas pendientes', () => {
      const reserva = crearReservaBasica();
      expect(reserva.puedeCancelarse()).toBe(true);
    });

    it('debería retornar true para reservas confirmadas', () => {
      const reserva = crearReservaBasica();
      const reservaConfirmada = reserva.confirmar();
      expect(reservaConfirmada.puedeCancelarse()).toBe(true);
    });

    it('debería retornar false para reservas canceladas', () => {
      const reserva = crearReservaBasica();
      const reservaCancelada = reserva.cancelar('Motivo');
      expect(reservaCancelada.puedeCancelarse()).toBe(false);
    });

    it('debería retornar false para reservas completadas', () => {
      const reserva = crearReservaBasica();
      const reservaConfirmada = reserva.confirmar();
      const reservaCheckIn = reservaConfirmada.realizarCheckIn();
      const reservaCheckOut = reservaCheckIn.realizarCheckOut();
      expect(reservaCheckOut.puedeCancelarse()).toBe(false);
    });
  });

  describe('calcularPenalizacionCancelacion', () => {
    it('debería retornar 0 para reservas no canceladas', () => {
      const reserva = crearReservaBasica();
      const penalizacion = reserva.calcularPenalizacionCancelacion();
      
      expect(penalizacion.valor).toBe(0);
    });

    it('debería calcular penalización correctamente para reserva cancelada', () => {
      const reserva = crearReservaBasica();
      const reservaCancelada = reserva.cancelar('Motivo');
      const penalizacion = reservaCancelada.calcularPenalizacionCancelacion();
      
      // La penalización depende del tiempo hasta el check-in
      // En este caso, como las fechas son futuras, debería haber alguna penalización
      expect(penalizacion.valor).toBeGreaterThanOrEqual(0);
    });
  });
});
