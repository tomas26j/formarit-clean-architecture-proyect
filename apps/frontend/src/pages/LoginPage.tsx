/**
 * Página de Login
 */
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { useToast } from '@/core/hooks/useToast'
import { Button } from '@/components/atoms'
import { Input } from '@/components/atoms'
import { ApiClientError } from '@/core/api/client'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, isAuthenticated } = useAuth()
  const toast = useToast()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirigir si ya está autenticado
  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
        toast.success('Inicio de sesión exitoso')
        navigate(from, { replace: true })
      } else {
        await register(nombre, email, password, telefono || undefined)
        toast.success('Registro exitoso')
        navigate(from, { replace: true })
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(error.message || 'Error al autenticarse')
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocurrió un error inesperado')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </h2>
          <p className="mt-2 text-base-content/70">
            {isLogin
              ? 'Ingresa tus credenciales para continuar'
              : 'Crea una cuenta para comenzar'}
          </p>
        </div>

        <div className="card bg-base-200 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input
                label="Nombre completo"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={isLoading}
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="tu@email.com"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="••••••••"
            />

            {!isLogin && (
              <Input
                label="Teléfono (opcional)"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                disabled={isLoading}
                placeholder="+1234567890"
              />
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              {isLogin
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>

        {/* Credenciales de prueba */}
        <div className="card bg-info/10 border border-info/20 p-4">
          <h3 className="font-semibold mb-2">🔑 Credenciales de Prueba</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>Huésped:</strong> juan@example.com / password123
            </p>
            <p>
              <strong>Recepcionista:</strong> recep@hotel.com / recep123
            </p>
            <p>
              <strong>Admin:</strong> admin@hotel.com / admin123
            </p>
          </div>
          <p className="text-xs mt-2 text-base-content/60">
            💡 Puedes usar cualquiera de estas credenciales para iniciar sesión.
            También puedes registrarte con un nuevo usuario.
          </p>
        </div>
      </div>
    </div>
  )
}

