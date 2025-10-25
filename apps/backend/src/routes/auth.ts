import { Router, Request, Response } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { asyncHandler, createError } from '../middleware/error-handler.js';
import { AutenticarUsuarioUseCase } from '@hotel/domain';

const router = Router();

// Esquemas de validación
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  telefono: Joi.string().optional(),
  rol: Joi.string().valid('huesped', 'recepcionista', 'gerente', 'admin').default('huesped')
});

// POST /api/auth/login
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  // Validar datos de entrada
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
  }

  const { email, password } = value;

  // TODO: Implementar AutenticarUsuarioUseCase con repositorio real
  // Por ahora, simulamos la autenticación
  if (email === 'admin@hotel.com' && password === 'admin123') {
    const token = jwt.sign(
      {
        userId: 'user-123',
        email: email,
        rol: 'admin'
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      usuario: {
        id: 'user-123',
        nombre: 'Administrador',
        email: email,
        rol: 'admin',
        activo: true
      },
      token,
      expiraEn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      permisos: ['*']
    });
  } else {
    throw createError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
  }
}));

// POST /api/auth/register
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  // Validar datos de entrada
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
  }

  const { nombre, email, password, telefono, rol } = value;

  // TODO: Implementar registro de usuario con repositorio real
  // Por ahora, simulamos el registro
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const token = jwt.sign(
    {
      userId: `user-${Date.now()}`,
      email: email,
      rol: rol
    },
    process.env.JWT_SECRET || 'secret-key',
    { expiresIn: '24h' }
  );

  res.status(201).json({
    usuario: {
      id: `user-${Date.now()}`,
      nombre: nombre,
      email: email,
      rol: rol,
      activo: true
    },
    token,
    expiraEn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    permisos: rol === 'admin' ? ['*'] : ['consultar_disponibilidad', 'crear_reserva', 'ver_mis_reservas']
  });
}));

// POST /api/auth/refresh
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw createError('Token requerido', 400, 'MISSING_TOKEN');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as any;
    
    // Generar nuevo token
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        rol: decoded.rol
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token: newToken,
      expiraEn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    throw createError('Token inválido', 401, 'INVALID_TOKEN');
  }
}));

// POST /api/auth/logout
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // En una implementación real, aquí invalidarías el token
  // Por ejemplo, agregándolo a una blacklist
  
  res.json({
    message: 'Sesión cerrada exitosamente',
    timestamp: new Date().toISOString()
  });
}));

export { router as authRouter };
