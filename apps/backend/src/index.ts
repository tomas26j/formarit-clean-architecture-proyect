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
