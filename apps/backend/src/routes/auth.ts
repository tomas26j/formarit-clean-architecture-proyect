/**
 * Rutas para autenticación
 * Implementación funcional con caso de uso real del dominio
 */

import { Router, Request, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { asyncHandler, createError } from '../middleware/error-handler.js';
import { BackendDependencies } from '../infrastructure/dependencies.js';
import { DomainError } from '@hotel/domain/src/shared/types/domain-errors.js';
import { Result } from '@hotel/domain/src/shared/types/result.js';
import { Usuario, RolUsuario, UsuarioImpl } from '@hotel/domain/src/entities/user.js';

/**
 * Crea el router de autenticación con las dependencias inyectadas
 */
export const crearAuthRouter = (deps: BackendDependencies): Router => {
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

  // POST /api/auth/login
  router.post('/login', asyncHandler(async (req: Request, res: Response) => {
    // Validar datos de entrada
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
    }

    // Llamar al caso de uso real
    const resultado = await deps.autenticarUsuario({
      email: value.email,
      password: value.password,
    });

    manejarResultado(resultado, res, 200);
  }));

  // POST /api/auth/register
  router.post('/register', asyncHandler(async (req: Request, res: Response) => {
    // Validar datos de entrada
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      throw createError(`Datos inválidos: ${error.details[0].message}`, 400, 'VALIDATION_ERROR');
    }

    const { nombre, email, password, telefono, rol } = value;

    // Verificar si el email ya existe
    const emailDisponible = await deps.repositorioUsuarios.verificarEmailDisponible(email);
    if (!emailDisponible) {
      throw createError('El email ya está registrado', 409, 'EMAIL_ALREADY_EXISTS');
    }

    // Mapear rol de string a enum
    const rolEnum: RolUsuario = rol as RolUsuario;

    // Crear nuevo usuario
    const nuevoUsuario = UsuarioImpl.crear(
      deps.generarId().replace('reserva', 'usuario'),
      nombre,
      email,
      rolEnum,
      telefono
    );

    // Guardar usuario
    await deps.repositorioUsuarios.guardar(nuevoUsuario);

    // Guardar contraseña usando la función helper
    if (deps.guardarContraseñaUsuario) {
      await deps.guardarContraseñaUsuario(email, password);
    } else {
      // Fallback si la función helper no está disponible
      throw createError(
        'Error al registrar usuario. Sistema de contraseñas no configurado.',
        500,
        'REGISTRATION_ERROR'
      );
    }

    // Autenticar el usuario recién creado para generar token
    const resultadoAutenticacion = await deps.autenticarUsuario({
      email,
      password,
    });

    manejarResultado(resultadoAutenticacion, res, 201);
  }));

  // POST /api/auth/refresh
  router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      throw createError('Token requerido', 400, 'MISSING_TOKEN');
    }

    try {
      const jwt = require('jsonwebtoken');
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

  return router;
};
