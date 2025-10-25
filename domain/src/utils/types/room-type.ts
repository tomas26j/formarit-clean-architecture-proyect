// Value Object: Tipo de habitación
export interface TipoHabitacion {
  readonly valor: string;
  readonly capacidad: number;
  readonly precioBase: number;
  readonly amenidades: string[];
  equals(otro: TipoHabitacion): boolean;
}

export class TipoHabitacionImpl implements TipoHabitacion {
  constructor(
    public readonly valor: string,
    public readonly capacidad: number,
    public readonly precioBase: number,
    public readonly amenidades: string[] = []
  ) {
    this.validarTipo();
  }

  private validarTipo(): void {
    if (this.capacidad <= 0) {
      throw new Error('La capacidad debe ser mayor a 0');
    }
    
    if (this.precioBase <= 0) {
      throw new Error('El precio base debe ser mayor a 0');
    }
    
    if (!this.valor || this.valor.trim().length === 0) {
      throw new Error('El tipo de habitación debe tener un nombre válido');
    }
  }

  equals(otro: TipoHabitacion): boolean {
    return this.valor === otro.valor;
  }

  static individual(): TipoHabitacion {
    return new TipoHabitacionImpl('individual', 1, 100, ['WiFi', 'TV']);
  }

  static doble(): TipoHabitacion {
    return new TipoHabitacionImpl('doble', 2, 150, ['WiFi', 'TV', 'Minibar']);
  }

  static suite(): TipoHabitacion {
    return new TipoHabitacionImpl('suite', 4, 300, ['WiFi', 'TV', 'Minibar', 'Jacuzzi', 'Vista al mar']);
  }

  static crear(valor: string, capacidad: number, precioBase: number, amenidades: string[] = []): TipoHabitacion {
    return new TipoHabitacionImpl(valor, capacidad, precioBase, amenidades);
  }
}

// Enums para facilitar el uso
export const TIPOS_HABITACION = {
  INDIVIDUAL: 'individual',
  DOBLE: 'doble',
  SUITE: 'suite'
} as const;

export type TipoHabitacionValor = typeof TIPOS_HABITACION[keyof typeof TIPOS_HABITACION];
