import { RepositorioReservas } from "../repositories/reserva-repository.js";
export interface CancelarReservaCommand {
    reservaId: string;
    motivo: string;
    canceladoPor: string;
}
export interface ReservaCanceladaResponse {
    reservaId: string;
    estado: string;
    canceladaEn: string;
    motivo: string;
    canceladoPor: string;
    penalizacion: {
        aplicada: boolean;
        monto: number;
        porcentaje: number;
    };
    reembolso: {
        monto: number;
        metodo: string;
    };
}
export declare class CancelarReservaUseCase {
    private repositorioReservas;
    constructor(repositorioReservas: RepositorioReservas);
    execute(command: CancelarReservaCommand): Promise<ReservaCanceladaResponse>;
    private validarCommand;
    private calcularReembolso;
    private calcularPorcentajePenalizacion;
}
