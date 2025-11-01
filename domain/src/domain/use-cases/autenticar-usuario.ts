/**
 * Caso de Uso: Autenticar Usuario
 * Implementado como función pura siguiendo Clean Architecture
 */

import { Result } from "../../shared/types/result.js";
import { DomainError, ValidationError, UnauthorizedError } from "../../shared/types/domain-errors.js";
import { RepositorioUsuarios } from "../../../repositories/usuario-repository.js";
import { Usuario, RolUsuario } from "../entities/usuario.js";

// DTOs para el caso de uso
export interface AutenticarUsuarioDTO {
  email: string;
  password: string;
}

export interface UsuarioAutenticadoDTO {
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
    activo: boolean;
  };
  token: string;
  expiraEn: string;
  permisos: string[];
}

// Dependencias del caso de uso
export interface AutenticarUsuarioDependencies {
  repositorioUsuarios: RepositorioUsuarios;
  generarToken: (usuario: Usuario) => string;
}

/**
 * Función pura para autenticar un usuario
 */
export const autenticarUsuario = async (
  command: AutenticarUsuarioDTO,
  dependencies: AutenticarUsuarioDependencies
): Promise<Result<UsuarioAutenticadoDTO, DomainError>> => {
  // 1. Validar datos de entrada
  const validacion = validarCommand(command);
  if (validacion.isFailure()) {
    return Result.failure(validacion.error);
  }

  // 2. Buscar usuario por email
  const usuario = await dependencies.repositorioUsuarios.buscarPorEmail(command.email);
  if (!usuario) {
    // No revelar si el email existe o no por seguridad
    return Result.failure(new UnauthorizedError('Credenciales inválidas'));
  }

  // 3. Verificar que el usuario está activo
  if (!usuario.activo) {
    return Result.failure(new UnauthorizedError('Usuario desactivado'));
  }

  // 4. Verificar credenciales usando el repositorio
  const credencialesValidas = await dependencies.repositorioUsuarios.verificarCredenciales(
    command.email,
    command.password
  );

  if (!credencialesValidas) {
    return Result.failure(new UnauthorizedError('Credenciales inválidas'));
  }

  // 5. Actualizar último acceso
  await dependencies.repositorioUsuarios.actualizarUltimoAcceso(usuario.id);

  // 6. Generar token
  const token = dependencies.generarToken(usuario);

  // 7. Obtener permisos del usuario
  const permisos = obtenerPermisos(usuario.rol);

  // 8. Calcular expiración del token
  const expiracion = new Date();
  expiracion.setHours(expiracion.getHours() + 24); // 24 horas

  // 9. Retornar respuesta
  return Result.success({
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
    },
    token,
    expiraEn: expiracion.toISOString(),
    permisos,
  });
};

/**
 * Valida el comando de autenticación
 */
const validarCommand = (command: AutenticarUsuarioDTO): Result<boolean, ValidationError> => {
  if (!command.email || command.email.trim().length === 0) {
    return Result.failure(new ValidationError('El email es requerido'));
  }

  if (!command.password || command.password.trim().length === 0) {
    return Result.failure(new ValidationError('La contraseña es requerida'));
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(command.email)) {
    return Result.failure(new ValidationError('El formato del email no es válido'));
  }

  // Validar longitud mínima de contraseña
  if (command.password.length < 6) {
    return Result.failure(new ValidationError('La contraseña debe tener al menos 6 caracteres'));
  }

  return Result.success(true);
};

/**
 * Obtiene los permisos según el rol del usuario
 */
const obtenerPermisos = (rol: RolUsuario): string[] => {
  const permisos: Record<RolUsuario, string[]> = {
    [RolUsuario.HUESPED]: [
      'consultar_disponibilidad',
      'crear_reserva',
      'ver_mis_reservas',
      'cancelar_mis_reservas',
    ],
    [RolUsuario.RECEPCIONISTA]: [
      'consultar_disponibilidad',
      'crear_reserva',
      'ver_reservas',
      'confirmar_reserva',
      'cancelar_reserva',
      'checkin',
      'checkout',
      'ver_habitaciones',
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
      'generar_reportes',
    ],
    [RolUsuario.ADMIN]: ['*'], // Acceso total
  };

  return permisos[rol] || [];
};

/**
 * Factory para crear el caso de uso con sus dependencias
 */
export const autenticarUsuarioUseCase = (dependencies: AutenticarUsuarioDependencies) => {
  return (command: AutenticarUsuarioDTO) => autenticarUsuario(command, dependencies);
};

