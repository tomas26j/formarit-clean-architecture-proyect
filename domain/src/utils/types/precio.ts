// Value Object: Precio
export interface Precio {
  readonly valor: number;
  readonly moneda: string;
  sumar(otro: Precio): Precio;
  multiplicar(factor: number): Precio;
  aplicarDescuento(porcentaje: number): Precio;
  equals(otro: Precio): boolean;
  esMayorQue(otro: Precio): boolean;
  esMenorQue(otro: Precio): boolean;
}

export class PrecioImpl implements Precio {
  constructor(
    public readonly valor: number,
    public readonly moneda: string = 'USD'
  ) {
    this.validarPrecio();
  }

  private validarPrecio(): void {
    if (this.valor < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    
    if (!this.moneda || this.moneda.trim().length === 0) {
      throw new Error('La moneda debe ser especificada');
    }
  }

  sumar(otro: Precio): Precio {
    this.validarMismaMoneda(otro);
    return new PrecioImpl(this.valor + otro.valor, this.moneda);
  }

  multiplicar(factor: number): Precio {
    if (factor < 0) {
      throw new Error('El factor de multiplicación no puede ser negativo');
    }
    return new PrecioImpl(this.valor * factor, this.moneda);
  }

  aplicarDescuento(porcentaje: number): Precio {
    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error('El porcentaje de descuento debe estar entre 0 y 100');
    }
    const descuento = this.valor * (porcentaje / 100);
    return new PrecioImpl(this.valor - descuento, this.moneda);
  }

  equals(otro: Precio): boolean {
    return this.valor === otro.valor && this.moneda === otro.moneda;
  }

  esMayorQue(otro: Precio): boolean {
    this.validarMismaMoneda(otro);
    return this.valor > otro.valor;
  }

  esMenorQue(otro: Precio): boolean {
    this.validarMismaMoneda(otro);
    return this.valor < otro.valor;
  }

  private validarMismaMoneda(otro: Precio): void {
    if (this.moneda !== otro.moneda) {
      throw new Error('No se pueden operar precios con diferentes monedas');
    }
  }

  static crear(valor: number, moneda: string = 'USD'): Precio {
    return new PrecioImpl(valor, moneda);
  }

  static cero(moneda: string = 'USD'): Precio {
    return new PrecioImpl(0, moneda);
  }
}
