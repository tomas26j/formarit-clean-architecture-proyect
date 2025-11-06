export interface Periodo {
    readonly checkIn: Date;
    readonly checkOut: Date;
    duracionEnNoches(): number;
    seSuperponeCon(otro: Periodo): boolean;
    esFuturo(): boolean;
    equals(otro: Periodo): boolean;
}
export declare class PeriodoImpl implements Periodo {
    readonly checkIn: Date;
    readonly checkOut: Date;
    constructor(checkIn: Date, checkOut: Date);
    private validarPeriodo;
    duracionEnNoches(): number;
    seSuperponeCon(otro: Periodo): boolean;
    esFuturo(): boolean;
    equals(otro: Periodo): boolean;
    static crear(checkIn: Date, checkOut: Date): Periodo;
}
export type Lapse = Periodo;
export declare const LapseImpl: typeof PeriodoImpl;
