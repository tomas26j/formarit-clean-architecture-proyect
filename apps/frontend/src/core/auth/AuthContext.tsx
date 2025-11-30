/**
 * Contexto de autenticación
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiPost, apiGet } from '../api/client'
import { endpoints } from '../api/endpoints'

export interface User {
  id: string
  nombre: string
  email: string
  rol: string
  activo: boolean
}

export interface AuthResponse {
  usuario: User
  token: string
  expiraEn: string
  permisos: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (nombre: string, email: string, password: string, telefono?: string) => Promise<void>
  token: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  // Cargar usuario y token del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error al cargar usuario del localStorage:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    
    setIsLoading(false)

    // Escuchar evento de logout
    const handleLogout = () => {
      setToken(null)
      setUser(null)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  // Guardar token y usuario en localStorage cuando cambian
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }, [token, user])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiPost<AuthResponse>(
        endpoints.auth.login(),
        { email, password },
        false // No incluir auth en el login
      )
      
      setToken(response.token)
      setUser(response.usuario)
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const register = async (nombre: string, email: string, password: string, telefono?: string) => {
    try {
      const response = await apiPost<AuthResponse>(
        endpoints.auth.register(),
        { nombre, email, password, telefono },
        false // No incluir auth en el registro
      )
      
      setToken(response.token)
      setUser(response.usuario)
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    // Opcional: llamar al endpoint de logout del backend
    // apiPost(endpoints.auth.logout(), {}, true).catch(console.error)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        register,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

