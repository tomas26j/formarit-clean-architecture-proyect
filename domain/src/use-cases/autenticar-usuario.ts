import { Usuario, RolUsuario } from "../entities/user.js";
import { RepositorioUsuarios } from "../repositories/usuario-repository.js";

// DTOs para el caso de uso
export interface AutenticarUsuarioCommand {
  email: string;
  password: string;
}

export interface UsuarioAutenticadoResponse {
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

// Caso de Uso: Autenticar Usuario
export class AutenticarUsuarioUseCase {
  constructor(
    private repositorioUsuarios: RepositorioUsuarios
  ) {}

  async execute(command: AutenticarUsuarioCommand): Promise<UsuarioAutenticadoResponse> {
    // 1. Validar datos de entrada
    this.validarCommand(command);

    // 2. Buscar usuario por email
    const usuario = await this.repositorioUsuarios.buscarPorEmail(command.email);
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // 3. Verificar que el usuario está activo
    if (!usuario.activo) {
      throw new Error('Usuario desactivado');
    }

    // 4. Verificar credenciales (en una implementación real, esto incluiría hash de password)
    const credencialesValidas = await this.verificarCredenciales(usuario, command.password);
    if (!credencialesValidas) {
      throw new Error('Credenciales inválidas');
    }

    // 5. Actualizar último acceso
    await this.repositorioUsuarios.actualizarUltimoAcceso(usuario.id);

    // 6. Generar token (en una implementación real, usarías JWT)
    const token = this.generarToken(usuario);

    // 7. Obtener permisos del usuario
    const permisos = this.obtenerPermisos(usuario.rol);

    // 8. Retornar respuesta
    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
      },
      token,
      expiraEn: this.calcularExpiracionToken(),
      permisos
    };
  }

  private validarCommand(command: AutenticarUsuarioCommand): void {
    if (!command.email || command.email.trim().length === 0) {
      throw new Error('El email es requerido');
    }

    if (!command.password || command.password.trim().length === 0) {
      throw new Error('La contraseña es requerida');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(command.email)) {
      throw new Error('El formato del email no es válido');
    }

    // Validar longitud mínima de contraseña
    if (command.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
  }

  private async verificarCredenciales(usuario: Usuario, password: string): Promise<boolean> {
    // En una implementación real, esto incluiría:
    // 1. Hash de la contraseña con bcrypt
    // 2. Comparación con el hash almacenado
    // 3. Posible verificación de intentos fallidos
    
    // Por simplicidad, simulamos la verificación
    // En producción, esto sería algo como:
    // return await bcrypt.compare(password, usuario.passwordHash);
    
    return true; // Simulación - siempre retorna true
  }

  private generarToken(usuario: Usuario): string {
    // En una implementación real, usarías JWT con:
    // - Payload: { userId, email, rol, iat, exp }
    // - Secret: process.env.JWT_SECRET
    // - Expiración: 24 horas
    
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    // Simulación de token JWT
    return `jwt_${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
  }

  private calcularExpiracionToken(): string {
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 24); // 24 horas
    return expiracion.toISOString();
  }

  private obtenerPermisos(rol: RolUsuario): string[] {
    const permisos: Record<RolUsuario, string[]> = {
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

    return permisos[rol] || [];
  }
}
