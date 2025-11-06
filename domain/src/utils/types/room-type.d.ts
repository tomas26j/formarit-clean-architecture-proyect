export interface TipoHabitacion {
    readonly valor: string;
    readonly capacidad: number;
    readonly precioBase: number;
    readonly amenidades: string[];
    equals(otro: TipoHabitacion): boolean;
}
export declare class TipoHabitacionImpl implements TipoHabitacion {
    readonly valor: string;
    readonly capacidad: number;
    readonly precioBase: number;
    readonly amenidades: string[];
    constructor(valor: string, capacidad: number, precioBase: number, amenidades?: string[]);
    private validarTipo;
    equals(otro: TipoHabitacion): boolean;
    static individual(): TipoHabitacion;
    static doble(): TipoHabitacion;
    static suite(): TipoHabitacion;
    static crear(valor: string, capacidad: number, precioBase: number, amenidades?: string[]): TipoHabitacion;
}
export declare const TIPOS_HABITACION: {
    readonly INDIVIDUAL: "individual";
    readonly DOBLE: "doble";
    readonly SUITE: "suite";
};
export type TipoHabitacionValor = typeof TIPOS_HABITACION[keyof typeof TIPOS_HABITACION];
