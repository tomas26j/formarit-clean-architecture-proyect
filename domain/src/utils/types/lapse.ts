// Value Object: Periodo de estadía
export interface Periodo {
  readonly checkIn: Date;
  readonly checkOut: Date;
  duracionEnNoches(): number;
  seSuperponeCon(otro: Periodo): boolean;
  esFuturo(): boolean;
  equals(otro: Periodo): boolean;
}

export class PeriodoImpl implements Periodo {
  constructor(
    public readonly checkIn: Date,
    public readonly checkOut: Date
  ) {
    this.validarPeriodo();
  }

  private validarPeriodo(): void {
    if (this.checkIn >= this.checkOut) {
      throw new Error('Check-in debe ser anterior a check-out');
    }
    
    if (this.checkIn < new Date()) {
      throw new Error('Las fechas de check-in deben ser futuras');
    }
  }

  duracionEnNoches(): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const timeDiff = this.checkOut.getTime() - this.checkIn.getTime();
    return Math.ceil(timeDiff / millisecondsPerDay);
  }

  seSuperponeCon(otro: Periodo): boolean {
    return this.checkIn < otro.checkOut && this.checkOut > otro.checkIn;
  }

  esFuturo(): boolean {
    return this.checkIn > new Date();
  }

  equals(otro: Periodo): boolean {
    return this.checkIn.getTime() === otro.checkIn.getTime() && 
           this.checkOut.getTime() === otro.checkOut.getTime();
  }

  static crear(checkIn: Date, checkOut: Date): Periodo {
    return new PeriodoImpl(checkIn, checkOut);
  }
}

// Alias para mantener compatibilidad
export type Lapse = Periodo;
export const LapseImpl = PeriodoImpl;