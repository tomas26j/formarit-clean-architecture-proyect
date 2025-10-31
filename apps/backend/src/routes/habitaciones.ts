/**
 * Rutas para gestión de habitaciones
 * Implementación funcional con repositorios reales del dominio
 */

import { Router, Response } from 'express';
import Joi from 'joi';
import { asyncHandler, createError } from '../middleware/error-handler.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { requirePermission } from '../middleware/auth.js';
import { BackendDependencies } from '../infrastructure/dependencies.js';
import { DomainError } from '@hotel/domain/src/shared/types/domain-errors.js';
import { Result } from '@hotel/domain/src/shared/types/result.js';
import { TipoHabitacion } from '@hotel/domain/src/shared/types/room-type.js';
import { Precio } from '@hotel/domain/src/shared/types/precio.js';

/**
 * Crea el router de habitaciones con las dependencias inyectadas
 */
export const crearHabitacionesRouter = (deps: BackendDependencies): Router => {
  const router = Router();

  // Esquemas de validación
  const crearHabitacionSchema = Joi.object({
    numero: Joi.string().required(),
    tipo: Joi.string().valid('individual', 'doble', 'suite').required(),
    precioBase: Joi.number().positive().required(),
    piso: Joi.number().integer().min(1).optional(),
    vista: Joi.string().max(100).optional()
  });

  const actualizarHabitacionSchema = Joi.object({
    numero: Joi.string().optional(),
    tipo: Joi.string().valid('individual', 'doble', 'suite').optional(),
    precioBase: Joi.number().positive().optional(),
    piso: Joi.number().integer().min(1).optional(),
    vista: Joi.string().max(100).optional(),
    activa: Joi.boolean().optional()
  });

  /**
   * Helper para crear tipo de habitación desde string
   */
  const crearTipoHabitacion = (tipo: string): TipoHabitacion => {
    const tipos: Record<string, TipoHabitacion> = {
      'individual': {
        id: 'tipo-individual',
        nombre: 'individual',
        descripcion: 'Habitación individual para una persona',
        capacidad: 1,
        amenidades: ['WiFi', 'TV']
      },
      'doble': {
        id: 'tipo-doble',
        nombre: 'doble',
        descripcion: 'Habitación doble para dos personas',
        capacidad: 2,
        amenidades: ['WiFi', 'TV', 'Minibar']
      },
      'suite': {
        id: 'tipo-suite',
        nombre: 'suite',
        descripcion: 'Suite de lujo para hasta 4 personas',
        capacidad: 4,
        amenidades: ['WiFi', 'TV', 'Minibar', 'Jacuzzi', 'Vista al mar']
      }
    };

    return tipos[tipo] || tipos['individual'];
  };

  /**
   * Helper para convertir entidad Habitacion a DTO
   */
  const habitacionToDTO = (habitacion: any) => ({
    id: habitacion.id,
    numero: habitacion.numero,
    tipo: habitacion.tipo.nombre,
    precioBase: habitacion.precioBase.valor,
    activa: habitacion.activa,
    piso: habitacion.piso,
    vista: habitacion.vista,
    capacidad: habitacion.tipo.capacidad,
    amenidades: habitacion.tipo.amenidades,
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

  // GET /api/habitaciones
  router.get('/', 
    requirePermission('ver_habitaciones'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      const resultado = await deps.repositorioHabitaciones.listar(limit, offset);
      
      if (resultado.isFailure()) {
        throw createError(
          resultado.error.message,
          resultado.error.statusCode || 500,
          resultado.error.code || 'DOMAIN_ERROR'
        );
      }

      const habitaciones = resultado.data;
      const habitacionesDTO = habitaciones.map(habitacionToDTO);

      res.json({
        habitaciones: habitacionesDTO,
        total: habitacionesDTO.length,
        pagina: Math.floor(offset / limit) + 1,
        limite: limit,
      });
    })
  );

  // GET /api/habitaciones/:id
  router.get('/:id', 
    requirePermission('ver_habitaciones'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const resultado = await deps.repositorioHabitaciones.buscarPorId(req.params.id);
      
      if (resultado.isFailure()) {
        throw createError(
          resultado.error.message,
          resultado.error.statusCode || 500,
          resultado.error.code || 'DOMAIN_ERROR'
        );
      }

      const habitacion = resultado.data;
      if (!habitacion) {
        throw createError('Habitación no encontrada', 404, 'NOT_FOUND');
      }

      res.json(habitacionToDTO(habitacion));
    })
  );

  // POST /api/habitaciones
  router.post('/', 
    requirePermission('gestionar_habitaciones'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const { error, value } = crearHabitacionSchema.validate(req.body);
      if (error) {
        throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
      }

      const tipo = crearTipoHabitacion(value.tipo);
      const precioBase: Precio = {
        valor: value.precioBase,
        moneda: 'USD'
      };

      const fechaActual = new Date();
      const nuevaHabitacion = {
        id: deps.generarId().replace('reserva', 'habitacion'),
        numero: value.numero,
        tipo,
        precioBase,
        activa: true,
        piso: value.piso || 1,
        vista: value.vista || 'estándar',
        fechaCreacion: fechaActual,
        fechaActualizacion: fechaActual,
      };

      const resultado = await deps.repositorioHabitaciones.guardar(nuevaHabitacion);
      manejarResultado(resultado, res, 201);
    })
  );

  // PUT /api/habitaciones/:id
  router.put('/:id', 
    requirePermission('gestionar_habitaciones'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const { error, value } = actualizarHabitacionSchema.validate(req.body);
      if (error) {
        throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
      }

      // Buscar habitación existente
      const habitacionResult = await deps.repositorioHabitaciones.buscarPorId(req.params.id);
      if (habitacionResult.isFailure() || !habitacionResult.data) {
        throw createError('Habitación no encontrada', 404, 'NOT_FOUND');
      }

      const habitacion = habitacionResult.data;
      
      // Actualizar campos si se proporcionan
      const tipo = value.tipo ? crearTipoHabitacion(value.tipo) : habitacion.tipo;
      const precioBase: Precio = value.precioBase 
        ? { valor: value.precioBase, moneda: habitacion.precioBase.moneda }
        : habitacion.precioBase;

      const habitacionActualizada = {
        ...habitacion,
        numero: value.numero || habitacion.numero,
        tipo,
        precioBase,
        piso: value.piso !== undefined ? value.piso : habitacion.piso,
        vista: value.vista || habitacion.vista,
        activa: value.activa !== undefined ? value.activa : habitacion.activa,
        fechaActualizacion: new Date(),
      };

      const resultado = await deps.repositorioHabitaciones.guardar(habitacionActualizada);
      manejarResultado(resultado, res, 200);
    })
  );

  // DELETE /api/habitaciones/:id
  router.delete('/:id', 
    requirePermission('gestionar_habitaciones'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const resultado = await deps.repositorioHabitaciones.eliminar(req.params.id);
      
      if (resultado.isFailure()) {
        throw createError(
          resultado.error.message,
          resultado.error.statusCode || 500,
          resultado.error.code || 'DOMAIN_ERROR'
        );
      }

      res.status(204).send();
    })
  );

  // POST /api/habitaciones/:id/activar
  router.post('/:id/activar', 
    requirePermission('gestionar_habitaciones'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const habitacionResult = await deps.repositorioHabitaciones.buscarPorId(req.params.id);
      
      if (habitacionResult.isFailure() || !habitacionResult.data) {
        throw createError('Habitación no encontrada', 404, 'NOT_FOUND');
      }

      const habitacion = habitacionResult.data;
      const habitacionActualizada = {
        ...habitacion,
        activa: true,
        fechaActualizacion: new Date(),
      };

      const resultado = await deps.repositorioHabitaciones.guardar(habitacionActualizada);
      manejarResultado(resultado, res, 200);
    })
  );

  // POST /api/habitaciones/:id/desactivar
  router.post('/:id/desactivar', 
    requirePermission('gestionar_habitaciones'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      const habitacionResult = await deps.repositorioHabitaciones.buscarPorId(req.params.id);
      
      if (habitacionResult.isFailure() || !habitacionResult.data) {
        throw createError('Habitación no encontrada', 404, 'NOT_FOUND');
      }

      const habitacion = habitacionResult.data;
      const habitacionActualizada = {
        ...habitacion,
        activa: false,
        fechaActualizacion: new Date(),
      };

      const resultado = await deps.repositorioHabitaciones.guardar(habitacionActualizada);
      manejarResultado(resultado, res, 200);
    })
  );

  // GET /api/habitaciones/tipos
  router.get('/tipos', 
    requirePermission('ver_habitaciones'),
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
      res.json({
        tipos: [
          {
            id: 'tipo-individual',
            nombre: 'individual',
            capacidad: 1,
            precioBase: 100,
            amenidades: ['WiFi', 'TV']
          },
          {
            id: 'tipo-doble',
            nombre: 'doble',
            capacidad: 2,
            precioBase: 150,
            amenidades: ['WiFi', 'TV', 'Minibar']
          },
          {
            id: 'tipo-suite',
            nombre: 'suite',
            capacidad: 4,
            precioBase: 300,
            amenidades: ['WiFi', 'TV', 'Minibar', 'Jacuzzi', 'Vista al mar']
          }
        ]
      });
    })
  );

  return router;
};
