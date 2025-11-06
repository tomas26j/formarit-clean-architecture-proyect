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
export declare class PrecioImpl implements Precio {
    readonly valor: number;
    readonly moneda: string;
    constructor(valor: number, moneda?: string);
    private validarPrecio;
    sumar(otro: Precio): Precio;
    multiplicar(factor: number): Precio;
    aplicarDescuento(porcentaje: number): Precio;
    equals(otro: Precio): boolean;
    esMayorQue(otro: Precio): boolean;
    esMenorQue(otro: Precio): boolean;
    private validarMismaMoneda;
    static crear(valor: number, moneda?: string): Precio;
    static cero(moneda?: string): Precio;
}
