import { Router, Response } from 'express';
import Joi from 'joi';
import { asyncHandler, createError } from '../middleware/error-handler.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { requirePermission } from '../middleware/auth.js';

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

// GET /api/habitaciones
router.get('/', 
  requirePermission('ver_habitaciones'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // TODO: Implementar listado de habitaciones con repositorio real
    res.json({
      habitaciones: [
        {
          id: 'habitacion-123',
          numero: '201',
          tipo: 'doble',
          precioBase: 150,
          activa: true,
          piso: 2,
          vista: 'vista al mar'
        },
        {
          id: 'habitacion-124',
          numero: '202',
          tipo: 'individual',
          precioBase: 100,
          activa: true,
          piso: 2,
          vista: 'vista al jardín'
        }
      ],
      total: 2,
      pagina: 1,
      limite: 10
    });
  })
);

// GET /api/habitaciones/:id
router.get('/:id', 
  requirePermission('ver_habitaciones'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // TODO: Implementar búsqueda de habitación por ID
    res.json({
      id: req.params.id,
      numero: '201',
      tipo: 'doble',
      precioBase: 150,
      activa: true,
      piso: 2,
      vista: 'vista al mar'
    });
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

    // TODO: Implementar creación de habitación con repositorio real
    const habitacionId = `habitacion_${Date.now()}`;
    
    res.status(201).json({
      id: habitacionId,
      numero: value.numero,
      tipo: value.tipo,
      precioBase: value.precioBase,
      activa: true,
      piso: value.piso || 1,
      vista: value.vista || 'estándar'
    });
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

    // TODO: Implementar actualización de habitación con repositorio real
    res.json({
      id: req.params.id,
      numero: value.numero || '201',
      tipo: value.tipo || 'doble',
      precioBase: value.precioBase || 150,
      activa: value.activa !== undefined ? value.activa : true,
      piso: value.piso || 2,
      vista: value.vista || 'vista al mar'
    });
  })
);

// DELETE /api/habitaciones/:id
router.delete('/:id', 
  requirePermission('gestionar_habitaciones'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // TODO: Implementar eliminación de habitación con repositorio real
    res.status(204).send();
  })
);

// POST /api/habitaciones/:id/activar
router.post('/:id/activar', 
  requirePermission('gestionar_habitaciones'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // TODO: Implementar activación de habitación
    res.json({
      id: req.params.id,
      activa: true,
      activadaEn: new Date().toISOString()
    });
  })
);

// POST /api/habitaciones/:id/desactivar
router.post('/:id/desactivar', 
  requirePermission('gestionar_habitaciones'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // TODO: Implementar desactivación de habitación
    res.json({
      id: req.params.id,
      activa: false,
      desactivadaEn: new Date().toISOString()
    });
  })
);

// GET /api/habitaciones/tipos
router.get('/tipos', 
  requirePermission('ver_habitaciones'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    res.json({
      tipos: [
        {
          valor: 'individual',
          capacidad: 1,
          precioBase: 100,
          amenidades: ['WiFi', 'TV']
        },
        {
          valor: 'doble',
          capacidad: 2,
          precioBase: 150,
          amenidades: ['WiFi', 'TV', 'Minibar']
        },
        {
          valor: 'suite',
          capacidad: 4,
          precioBase: 300,
          amenidades: ['WiFi', 'TV', 'Minibar', 'Jacuzzi', 'Vista al mar']
        }
      ]
    });
  })
);

export { router as habitacionesRouter };
