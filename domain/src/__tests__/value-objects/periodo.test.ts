import { describe, it, expect } from 'vitest';
import { PeriodoImpl } from '../../utils/types/lapse.js';

describe('PeriodoImpl', () => {
  describe('constructor', () => {
    it('debería crear un período válido con fechas correctas', () => {
      const checkIn = new Date('2024-01-15');
      const checkOut = new Date('2024-01-20');
      
      const periodo = new PeriodoImpl(checkIn, checkOut);
      
      expect(periodo.checkIn).toBe(checkIn);
      expect(periodo.checkOut).toBe(checkOut);
    });

    it('debería fallar si check-in es posterior a check-out', () => {
      const checkIn = new Date('2024-01-20');
      const checkOut = new Date('2024-01-15');
      
      expect(() => {
        new PeriodoImpl(checkIn, checkOut);
      }).toThrow('Check-in debe ser anterior a check-out');
    });

    it('debería fallar si check-in es igual a check-out', () => {
      const fecha = new Date('2024-01-15');
      
      expect(() => {
        new PeriodoImpl(fecha, fecha);
      }).toThrow('Check-in debe ser anterior a check-out');
    });

    it('debería fallar si check-in es en el pasado', () => {
      const checkIn = new Date('2020-01-15');
      const checkOut = new Date('2024-01-20');
      
      expect(() => {
        new PeriodoImpl(checkIn, checkOut);
      }).toThrow('Las fechas de check-in deben ser futuras');
    });
  });

  describe('duracionEnNoches', () => {
    it('debería calcular correctamente la duración en noches', () => {
      const checkIn = new Date('2024-01-15');
      const checkOut = new Date('2024-01-20');
      const periodo = new PeriodoImpl(checkIn, checkOut);
      
      expect(periodo.duracionEnNoches()).toBe(5);
    });

    it('debería calcular correctamente la duración para una noche', () => {
      const checkIn = new Date('2024-01-15');
      const checkOut = new Date('2024-01-16');
      const periodo = new PeriodoImpl(checkIn, checkOut);
      
      expect(periodo.duracionEnNoches()).toBe(1);
    });
  });

  describe('seSuperponeCon', () => {
    it('debería detectar superposición cuando períodos se superponen', () => {
      const periodo1 = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-20')
      );
      const periodo2 = new PeriodoImpl(
        new Date('2024-01-18'),
        new Date('2024-01-25')
      );
      
      expect(periodo1.seSuperponeCon(periodo2)).toBe(true);
      expect(periodo2.seSuperponeCon(periodo1)).toBe(true);
    });

    it('debería detectar que no hay superposición cuando períodos no se superponen', () => {
      const periodo1 = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-20')
      );
      const periodo2 = new PeriodoImpl(
        new Date('2024-01-21'),
        new Date('2024-01-25')
      );
      
      expect(periodo1.seSuperponeCon(periodo2)).toBe(false);
      expect(periodo2.seSuperponeCon(periodo1)).toBe(false);
    });

    it('debería detectar superposición cuando un período contiene al otro', () => {
      const periodo1 = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-25')
      );
      const periodo2 = new PeriodoImpl(
        new Date('2024-01-18'),
        new Date('2024-01-22')
      );
      
      expect(periodo1.seSuperponeCon(periodo2)).toBe(true);
      expect(periodo2.seSuperponeCon(periodo1)).toBe(true);
    });
  });

  describe('equals', () => {
    it('debería retornar true para períodos iguales', () => {
      const checkIn = new Date('2024-01-15');
      const checkOut = new Date('2024-01-20');
      const periodo1 = new PeriodoImpl(checkIn, checkOut);
      const periodo2 = new PeriodoImpl(checkIn, checkOut);
      
      expect(periodo1.equals(periodo2)).toBe(true);
    });

    it('debería retornar false para períodos diferentes', () => {
      const periodo1 = new PeriodoImpl(
        new Date('2024-01-15'),
        new Date('2024-01-20')
      );
      const periodo2 = new PeriodoImpl(
        new Date('2024-01-16'),
        new Date('2024-01-20')
      );
      
      expect(periodo1.equals(periodo2)).toBe(false);
    });
  });
});
