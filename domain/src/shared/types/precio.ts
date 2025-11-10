/**
 * Value Object para representar un precio
 */

export interface Precio {
  readonly valor: number;
  readonly moneda: string;
}

export interface PrecioVO extends Precio {
  esValido(): boolean;
  esMayorQue(otro: Precio): boolean;
  esMenorQue(otro: Precio): boolean;
  esIgualA(otro: Precio): boolean;
  sumar(otro: Precio): PrecioVO;
  restar(otro: Precio): PrecioVO;
  multiplicar(factor: number): PrecioVO;
  dividir(divisor: number): PrecioVO;
}
