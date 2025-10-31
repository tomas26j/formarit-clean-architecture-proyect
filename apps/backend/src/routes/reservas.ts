/**
 * Rutas para gestión de reservas
 * Implementación funcional con casos de uso reales del dominio
 */

import { Router, Response } from 'express';
import Joi from 'joi';
import { asyncHandler, createError } from '../middleware/error-handler.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { requirePermission } from '../middleware/auth.js';
import { BackendDependencies } from '../infrastructure/dependencies.js';
import { DomainError } from '@hotel/domain/src/shared/types/domain-errors.js';
import { Result } from '@hotel/domain/src/shared/types/result.js';

/**
 * Crea el router de reservas con las dependencias inyectadas
 */
export const crearReservasRouter = (deps: BackendDependencies): Router => {
  const router = Router();

  // Esquemas de validación
  const crearReservaSchema = Joi.object({
    habitacionId: Joi.string().required(),
    clienteId: Joi.string().required(),
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
    numeroHuespedes: Joi.number().integer().min(1).required(),
    observaciones: Joi.string().max(500).optional()
  });

  const confirmarReservaSchema = Joi.object({
    metodoPago: Joi.string().valid('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo').required(),
    numeroTarjeta: Joi.string().when('metodoPago', {
      is: Joi.string().valid('tarjeta_credito', 'tarjeta_debito'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    codigoSeguridad: Joi.string().when('metodoPago', {
      is: Joi.string().valid('tarjeta_credito', 'tarjeta_debito'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    fechaVencimiento: Joi.string().when('metodoPago', {
      is: Joi.string().valid('tarjeta_credito', 'tarjeta_debito'),
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  });

  const cancelarReservaSchema = Joi.object({
    motivo: Joi.string().min(10).max(500).required()
  });

  const consultarDisponibilidadSchema = Joi.object({
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
    tipoHabitacion: Joi.string().valid('individual', 'doble', 'suite').optional(),
    capacidadMinima: Joi.number().integer().min(1).optional(),
    precioMaximo: Joi.number().positive().optional()
  });

  /**
   * Helper para convertir Result a respuesta HTTP o error
   */
  const manejarResultado = <T>(
    result: Result<T, DomainError>,
    res: Response,
    statusCodeExitoso: number = 200
  ): void => {
    if (result.isFailure()) {
      const error = result.error;
      throw createError(
        error.message,
        error.statusCode || 500,
        error.code || 'DOMAIN_ERROR'
      );
    }
    res.status(statusCodeExitoso).json(result.data);
  };

  // GET /api/reservas/disponibilidad
  router.get('/disponibilidad', 
    requirePermission('consultar_disponibilidad'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const { error, value } = consultarDisponibilidadSchema.validate(req.query);
      if (error) {
        throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
      }

      // Llamar al caso de uso real
      const resultado = await deps.consultarDisponibilidad({
        checkIn: value.checkIn.toISOString(),
        checkOut: value.checkOut.toISOString(),
        tipoHabitacion: value.tipoHabitacion,
        capacidadMinima: value.capacidadMinima,
        precioMaximo: value.precioMaximo,
      });

      manejarResultado(resultado, res, 200);
    })
  );

  // POST /api/reservas
  router.post('/', 
    requirePermission('crear_reserva'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const { error, value } = crearReservaSchema.validate(req.body);
      if (error) {
        throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
      }

      // Llamar al caso de uso real
      const resultado = await deps.crearReserva({
        habitacionId: value.habitacionId,
        clienteId: value.clienteId,
        checkIn: value.checkIn.toISOString(),
        checkOut: value.checkOut.toISOString(),
        numeroHuespedes: value.numeroHuespedes,
        observaciones: value.observaciones,
      });

      manejarResultado(resultado, res, 201);
    })
  );

  // POST /api/reservas/:id/confirmar
  router.post('/:id/confirmar', 
    requirePermission('confirmar_reserva'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const { error, value } = confirmarReservaSchema.validate(req.body);
      if (error) {
        throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
      }

      // Llamar al caso de uso real
      const resultado = await deps.confirmarReserva({
        reservaId: req.params.id,
        metodoPago: value.metodoPago,
        numeroTarjeta: value.numeroTarjeta,
        codigoSeguridad: value.codigoSeguridad,
        fechaVencimiento: value.fechaVencimiento,
      });

      manejarResultado(resultado, res, 200);
    })
  );

  // POST /api/reservas/:id/cancelar
  router.post('/:id/cancelar', 
    requirePermission('cancelar_reserva'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const { error, value } = cancelarReservaSchema.validate(req.body);
      if (error) {
        throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
      }

      // Llamar al caso de uso real
      const resultado = await deps.cancelarReserva({
        reservaId: req.params.id,
        motivo: value.motivo,
        canceladoPor: req.user?.userId || 'unknown',
      });

      manejarResultado(resultado, res, 200);
    })
  );

  // GET /api/reservas
  router.get('/', 
    requirePermission('ver_reservas'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      // Usar el repositorio directamente
      const resultado = await deps.repositorioReservas.listar(limit, offset);
      
      if (resultado.isFailure()) {
        throw createError(
          resultado.error.message,
          resultado.error.statusCode || 500,
          resultado.error.code || 'DOMAIN_ERROR'
        );
      }

      const reservas = resultado.data;
      // Convertir entidades a DTOs simples para la respuesta
      const reservasDTO = reservas.map((reserva) => ({
        id: reserva.id,
        habitacionId: reserva.habitacionId,
        clienteId: reserva.clienteId,
        estado: reserva.estado,
        checkIn: reserva.periodo.checkIn.toISOString(),
        checkOut: reserva.periodo.checkOut.toISOString(),
        precioTotal: reserva.precioTotal.valor,
        numeroHuespedes: reserva.numeroHuespedes,
        observaciones: reserva.observaciones,
        fechaCreacion: reserva.fechaCreacion.toISOString(),
        fechaActualizacion: reserva.fechaActualizacion.toISOString(),
      }));

      res.json({
        reservas: reservasDTO,
        total: reservasDTO.length,
        pagina: Math.floor(offset / limit) + 1,
        limite: limit,
      });
    })
  );

  // GET /api/reservas/:id
  router.get('/:id', 
    requirePermission('ver_reservas'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const resultado = await deps.repositorioReservas.buscarPorId(req.params.id);
      
      if (resultado.isFailure()) {
        throw createError(
          resultado.error.message,
          resultado.error.statusCode || 500,
          resultado.error.code || 'DOMAIN_ERROR'
        );
      }

      const reserva = resultado.data;
      if (!reserva) {
        throw createError('Reserva no encontrada', 404, 'NOT_FOUND');
      }

      // Convertir entidad a DTO
      res.json({
        id: reserva.id,
        habitacionId: reserva.habitacionId,
        clienteId: reserva.clienteId,
        estado: reserva.estado,
        checkIn: reserva.periodo.checkIn.toISOString(),
        checkOut: reserva.periodo.checkOut.toISOString(),
        precioTotal: reserva.precioTotal.valor,
        numeroHuespedes: reserva.numeroHuespedes,
        observaciones: reserva.observaciones,
        motivoCancelacion: reserva.motivoCancelacion,
        fechaCreacion: reserva.fechaCreacion.toISOString(),
        fechaActualizacion: reserva.fechaActualizacion.toISOString(),
      });
    })
  );

  return router;
};
