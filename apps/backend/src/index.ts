import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Joi from 'joi';

//import { errorHandler, notFoundHandler, authMiddleware, loggingMiddleware } from './middleware/index.js';

import { errorHandler, asyncHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found-handler.js';
import { authMiddleware } from './middleware/auth.js';
import { loggingMiddleware } from './middleware/logging.js';

import { crearDependencias, BackendDependencies } from './infrastructure/dependencies.js';
import { crearReservasRouter } from './routes/reservas.js';
import { crearHabitacionesRouter } from './routes/habitaciones.js';
import { crearAuthRouter } from './routes/auth.js';
import { healthRouter } from './routes/health.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // máximo 100 requests por IP por ventana
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares de seguridad y configuración
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
//app.use(compression());
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging personalizado
app.use(loggingMiddleware);

// Inicializar dependencias del sistema
const dependencias = crearDependencias();

// Rutas públicas
app.use('/api/health', healthRouter);
app.use('/api/auth', crearAuthRouter(dependencias));

// Rutas públicas de consulta (no requieren autenticación)
// GET /api/reservas/disponibilidad - Consultar disponibilidad (pública)
app.get('/api/reservas/disponibilidad', asyncHandler(async (req: Request, res: Response) => {
  const consultarDisponibilidadSchema = Joi.object({
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
    tipoHabitacion: Joi.string().valid('individual', 'doble', 'suite').optional(),
    capacidadMinima: Joi.number().integer().min(1).optional(),
    precioMaximo: Joi.number().positive().optional()
  });

  const { error, value } = consultarDisponibilidadSchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      error: {
        message: `Datos inválidos: ${error.details[0].message}`,
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }

  const resultado = await dependencias.consultarDisponibilidad({
    checkIn: value.checkIn.toISOString(),
    checkOut: value.checkOut.toISOString(),
    tipoHabitacion: value.tipoHabitacion,
    capacidadMinima: value.capacidadMinima,
    precioMaximo: value.precioMaximo,
  });

  if (resultado.isFailure()) {
    const error = resultado.error;
    return res.status(error.statusCode || 500).json({
      error: {
        message: error.message,
        code: error.code || 'DOMAIN_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }

  res.json(resultado.data);
}));

// GET /api/habitaciones - Listar habitaciones (pública)
app.get('/api/habitaciones', asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

  const resultado = await dependencias.repositorioHabitaciones.listar(limit, offset);
  
  if (resultado.isFailure()) {
    return res.status(resultado.error.statusCode || 500).json({
      error: {
        message: resultado.error.message,
        code: resultado.error.code || 'DOMAIN_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }

  const habitaciones = resultado.data;
  const habitacionesDTO = habitaciones.map((habitacion: any) => ({
    id: habitacion.id,
    numero: habitacion.numero,
    tipo: habitacion.tipo.nombre,
    precioBase: habitacion.precioBase.valor,
    activa: habitacion.activa,
    piso: habitacion.piso,
    vista: habitacion.vista,
    capacidad: habitacion.tipo.capacidad,
    amenidades: habitacion.tipo.amenidades,
  }));

  res.json({
    habitaciones: habitacionesDTO,
    total: habitacionesDTO.length,
    pagina: Math.floor(offset / limit) + 1,
    limite: limit,
  });
}));

// GET /api/habitaciones/:id - Ver detalle de habitación (pública)
app.get('/api/habitaciones/:id', asyncHandler(async (req: Request, res: Response) => {
  const resultado = await dependencias.repositorioHabitaciones.buscarPorId(req.params.id);
  
  if (resultado.isFailure()) {
    return res.status(resultado.error.statusCode || 500).json({
      error: {
        message: resultado.error.message,
        code: resultado.error.code || 'DOMAIN_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }

  const habitacion = resultado.data;
  if (!habitacion) {
    return res.status(404).json({
      error: {
        message: 'Habitación no encontrada',
        code: 'NOT_FOUND',
        timestamp: new Date().toISOString()
      }
    });
  }

  const habitacionDTO = {
    id: habitacion.id,
    numero: habitacion.numero,
    tipo: habitacion.tipo.nombre,
    precioBase: habitacion.precioBase.valor,
    activa: habitacion.activa,
    piso: habitacion.piso,
    vista: habitacion.vista,
    capacidad: habitacion.tipo.capacidad,
    amenidades: habitacion.tipo.amenidades,
  };

  res.json(habitacionDTO);
}));

// Middleware de autenticación para rutas protegidas
app.use('/api', authMiddleware);

// Rutas protegidas (reciben dependencias)
app.use('/api/reservas', crearReservasRouter(dependencias));
app.use('/api/habitaciones', crearHabitacionesRouter(dependencias));

// Middlewares de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`📊 Health check disponible en http://localhost:${PORT}/api/health`);
  console.log(`🔐 Autenticación disponible en http://localhost:${PORT}/api/auth`);
});

export default app;
