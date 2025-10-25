import type { Entity } from "../utils/types/entity";

// Roles del sistema
export enum RolUsuario {
  HUESPED = 'huesped',
  RECEPCIONISTA = 'recepcionista',
  GERENTE = 'gerente',
  ADMIN = 'admin'
}

// Agregado: Usuario
export interface Usuario extends Entity {
  readonly nombre: string;
  readonly email: string;
  readonly rol: RolUsuario;
  readonly activo: boolean;
  readonly clienteId?: string; // Opcional: vincula a datos de cliente
  readonly telefono?: string;
  readonly fechaRegistro: Date;
  
  // Comportamientos del agregado
  desactivar(): Usuario;
  activar(): Usuario;
  cambiarRol(nuevoRol: RolUsuario): Usuario;
  actualizarTelefono(telefono: string): Usuario;
  vincularCliente(clienteId: string): Usuario;
  puedeAccederARecurso(recurso: string): boolean;
}

export class UsuarioImpl implements Usuario {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly email: string,
    public readonly rol: RolUsuario,
    public readonly activo: boolean = true,
    public readonly clienteId?: string,
    public readonly telefono?: string,
    public readonly fechaRegistro: Date = new Date()
  ) {
    this.validarUsuario();
  }

  private validarUsuario(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }
    
    if (!this.email || this.email.trim().length === 0) {
      throw new Error('El email es requerido');
    }
    
    if (!this.validarEmail(this.email)) {
      throw new Error('El formato del email no es válido');
    }
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  desactivar(): Usuario {
    if (!this.activo) {
      throw new Error('El usuario ya está desactivado');
    }
    
    return new UsuarioImpl(
      this.id,
      this.nombre,
      this.email,
      this.rol,
      false,
      this.clienteId,
      this.telefono,
      this.fechaRegistro
    );
  }

  activar(): Usuario {
    if (this.activo) {
      throw new Error('El usuario ya está activo');
    }
    
    return new UsuarioImpl(
      this.id,
      this.nombre,
      this.email,
      this.rol,
      true,
      this.clienteId,
      this.telefono,
      this.fechaRegistro
    );
  }

  cambiarRol(nuevoRol: RolUsuario): Usuario {
    if (this.rol === nuevoRol) {
      throw new Error('El usuario ya tiene este rol');
    }
    
    return new UsuarioImpl(
      this.id,
      this.nombre,
      this.email,
      nuevoRol,
      this.activo,
      this.clienteId,
      this.telefono,
      this.fechaRegistro
    );
  }

  actualizarTelefono(telefono: string): Usuario {
    if (!telefono || telefono.trim().length === 0) {
      throw new Error('El teléfono es requerido');
    }
    
    return new UsuarioImpl(
      this.id,
      this.nombre,
      this.email,
      this.rol,
      this.activo,
      this.clienteId,
      telefono,
      this.fechaRegistro
    );
  }

  vincularCliente(clienteId: string): Usuario {
    if (!clienteId || clienteId.trim().length === 0) {
      throw new Error('El ID del cliente es requerido');
    }
    
    if (this.clienteId === clienteId) {
      throw new Error('El usuario ya está vinculado a este cliente');
    }
    
    return new UsuarioImpl(
      this.id,
      this.nombre,
      this.email,
      this.rol,
      this.activo,
      clienteId,
      this.telefono,
      this.fechaRegistro
    );
  }

  puedeAccederARecurso(recurso: string): boolean {
    if (!this.activo) {
      return false;
    }
    
    // Matriz de permisos por rol
    const permisos: Record<RolUsuario, string[]> = {
      [RolUsuario.HUESPED]: ['consultar_disponibilidad', 'crear_reserva', 'ver_mis_reservas'],
      [RolUsuario.RECEPCIONISTA]: ['consultar_disponibilidad', 'crear_reserva', 'ver_reservas', 'checkin', 'checkout'],
      [RolUsuario.GERENTE]: ['consultar_disponibilidad', 'crear_reserva', 'ver_reservas', 'checkin', 'checkout', 'gestionar_habitaciones', 'reportes'],
      [RolUsuario.ADMIN]: ['*'] // Acceso total
    };
    
    const permisosRol = permisos[this.rol];
    return permisosRol.includes('*') || permisosRol.includes(recurso);
  }

  static crear(
    id: string,
    nombre: string,
    email: string,
    rol: RolUsuario,
    telefono?: string
  ): Usuario {
    return new UsuarioImpl(id, nombre, email, rol, true, undefined, telefono);
  }
}

// Alias para mantener compatibilidad
export type User = Usuario;
export const UserImpl = UsuarioImpl;