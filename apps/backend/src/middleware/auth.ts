import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RolUsuario } from '@hotel/domain';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    rol: RolUsuario;
    iat: number;
    exp: number;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          message: 'Token de autorización requerido',
          code: 'MISSING_TOKEN',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET no está configurado');
      res.status(500).json({
        error: {
          message: 'Error de configuración del servidor',
          code: 'SERVER_CONFIG_ERROR',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: {
          message: 'Token inválido',
          code: 'INVALID_TOKEN',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: {
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }
};

export const requireRole = (roles: RolUsuario[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Usuario no autenticado',
          code: 'UNAUTHENTICATED',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    if (!roles.includes(req.user.rol)) {
      res.status(403).json({
        error: {
          message: 'Permisos insuficientes',
          code: 'INSUFFICIENT_PERMISSIONS',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Usuario no autenticado',
          code: 'UNAUTHENTICATED',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    // Verificar si el usuario tiene el permiso específico
    const userPermissions = getUserPermissions(req.user.rol);
    
    if (!userPermissions.includes('*') && !userPermissions.includes(permission)) {
      res.status(403).json({
        error: {
          message: `Permiso requerido: ${permission}`,
          code: 'MISSING_PERMISSION',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    next();
  };
};

function getUserPermissions(rol: RolUsuario): string[] {
  const permissions: Record<RolUsuario, string[]> = {
    [RolUsuario.HUESPED]: [
      'consultar_disponibilidad',
      'crear_reserva',
      'ver_mis_reservas',
      'cancelar_mis_reservas'
    ],
    [RolUsuario.RECEPCIONISTA]: [
      'consultar_disponibilidad',
      'crear_reserva',
      'ver_reservas',
      'confirmar_reserva',
      'cancelar_reserva',
      'checkin',
      'checkout',
      'ver_habitaciones'
    ],
    [RolUsuario.GERENTE]: [
      'consultar_disponibilidad',
      'crear_reserva',
      'ver_reservas',
      'confirmar_reserva',
      'cancelar_reserva',
      'checkin',
      'checkout',
      'gestionar_habitaciones',
      'gestionar_usuarios',
      'ver_reportes',
      'generar_reportes'
    ],
    [RolUsuario.ADMIN]: ['*'] // Acceso total
  };

  return permissions[rol] || [];
}
