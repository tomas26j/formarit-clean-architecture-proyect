import { Router, Response } from 'express';
import Joi from 'joi';
import { asyncHandler, createError } from '../middleware/error-handler.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { requirePermission } from '../middleware/auth.js';
import { 
  CrearReservaUseCase, 
  ConfirmarReservaUseCase, 
  CancelarReservaUseCase,
  ConsultarDisponibilidadUseCase 
} from '@hotel/domain';

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
  reservaId: Joi.string().required(),
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
  reservaId: Joi.string().required(),
  motivo: Joi.string().min(10).max(500).required()
});

const consultarDisponibilidadSchema = Joi.object({
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
  tipoHabitacion: Joi.string().valid('individual', 'doble', 'suite').optional(),
  capacidadMinima: Joi.number().integer().min(1).optional(),
  precioMaximo: Joi.number().positive().optional()
});

// TODO: Inyectar dependencias reales
// Por ahora, creamos instancias mock
const crearReservaUseCase = new CrearReservaUseCase(
  {} as any, // repositorioReservas
  {} as any, // repositorioHabitaciones
  {} as any, // servicioDisponibilidad
  {} as any  // servicioPrecios
);

const confirmarReservaUseCase = new ConfirmarReservaUseCase(
  {} as any, // repositorioReservas
  {} as any, // repositorioHabitaciones
  {} as any  // servicioDisponibilidad
);

const cancelarReservaUseCase = new CancelarReservaUseCase(
  {} as any // repositorioReservas
);

const consultarDisponibilidadUseCase = new ConsultarDisponibilidadUseCase(
  {} as any, // repositorioHabitaciones
  {} as any  // servicioDisponibilidad
);

// GET /api/reservas/disponibilidad
router.get('/disponibilidad', 
  requirePermission('consultar_disponibilidad'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { error, value } = consultarDisponibilidadSchema.validate(req.query);
    if (error) {
      throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
    }

    // TODO: Implementar con casos de uso reales
    // Por ahora, retornamos datos mock
    res.json({
      habitaciones: [
        {
          id: 'habitacion-123',
          numero: '201',
          tipo: 'doble',
          capacidad: 2,
          precioBase: 150,
          precioTotal: 750,
          piso: 2,
          vista: 'vista al mar',
          amenidades: ['WiFi', 'TV', 'Minibar']
        }
      ],
      totalDisponibles: 1,
      periodo: {
        checkIn: value.checkIn,
        checkOut: value.checkOut,
        duracionNoches: 5
      }
    });
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

    // TODO: Implementar con casos de uso reales
    // Por ahora, retornamos datos mock
    const reservaId = `reserva_${Date.now()}`;
    
    res.status(201).json({
      reservaId,
      estado: 'pendiente',
      precioTotal: 750,
      periodo: {
        checkIn: value.checkIn,
        checkOut: value.checkOut
      },
      numeroHuespedes: value.numeroHuespedes,
      observaciones: value.observaciones
    });
  })
);

// POST /api/reservas/:id/confirmar
router.post('/:id/confirmar', 
  requirePermission('confirmar_reserva'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { error, value } = confirmarReservaSchema.validate({
      ...req.body,
      reservaId: req.params.id
    });
    if (error) {
      throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
    }

    // TODO: Implementar con casos de uso reales
    res.json({
      reservaId: req.params.id,
      estado: 'confirmada',
      confirmadaEn: new Date().toISOString(),
      metodoPago: value.metodoPago,
      precioTotal: 750,
      periodo: {
        checkIn: '2024-01-15T00:00:00.000Z',
        checkOut: '2024-01-20T00:00:00.000Z'
      }
    });
  })
);

// POST /api/reservas/:id/cancelar
router.post('/:id/cancelar', 
  requirePermission('cancelar_reserva'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { error, value } = cancelarReservaSchema.validate({
      ...req.body,
      reservaId: req.params.id
    });
    if (error) {
      throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
    }

    // TODO: Implementar con casos de uso reales
    res.json({
      reservaId: req.params.id,
      estado: 'cancelada',
      canceladaEn: new Date().toISOString(),
      motivo: value.motivo,
      canceladoPor: req.user?.userId || 'unknown',
      penalizacion: {
        aplicada: false,
        monto: 0,
        porcentaje: 0
      },
      reembolso: {
        monto: 750,
        metodo: 'mismo_metodo_pago'
      }
    });
  })
);

// GET /api/reservas
router.get('/', 
  requirePermission('ver_reservas'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // TODO: Implementar listado de reservas
    res.json({
      reservas: [],
      total: 0,
      pagina: 1,
      limite: 10
    });
  })
);

// GET /api/reservas/:id
router.get('/:id', 
  requirePermission('ver_reservas'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // TODO: Implementar búsqueda de reserva por ID
    res.json({
      id: req.params.id,
      estado: 'pendiente',
      habitacionId: 'habitacion-123',
      clienteId: 'cliente-456',
      periodo: {
        checkIn: '2024-01-15T00:00:00.000Z',
        checkOut: '2024-01-20T00:00:00.000Z'
      },
      precioTotal: 750,
      numeroHuespedes: 2
    });
  })
);

export { router as reservasRouter };
