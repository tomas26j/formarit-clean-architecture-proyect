import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

//import { errorHandler, notFoundHandler, authMiddleware, loggingMiddleware } from './middleware/index.js';

import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found-handler.js';
import { authMiddleware } from './middleware/auth.js';
import { loggingMiddleware } from './middleware/logging.js';

import { reservasRouter } from './routes/reservas.js';
import { habitacionesRouter } from './routes/habitaciones.js';
import { authRouter } from './routes/auth.js';
import { healthRouter } from './routes/health.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Rutas públicas
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// Middleware de autenticación para rutas protegidas
app.use('/api', authMiddleware);

// Rutas protegidas
app.use('/api/reservas', reservasRouter);
app.use('/api/habitaciones', habitacionesRouter);

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
