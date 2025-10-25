/**
 * Value Object para representar un precio
 */

export interface Precio {
  readonly valor: number;
  readonly moneda: string;
}

export interface PrecioVO extends Precio {
  readonly esValido(): boolean;
  readonly esMayorQue(otro: Precio): boolean;
  readonly esMenorQue(otro: Precio): boolean;
  readonly esIgualA(otro: Precio): boolean;
  readonly sumar(otro: Precio): PrecioVO;
  readonly restar(otro: Precio): PrecioVO;
  readonly multiplicar(factor: number): PrecioVO;
  readonly dividir(divisor: number): PrecioVO;
}
