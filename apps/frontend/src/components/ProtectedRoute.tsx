/**
 * Componente para proteger rutas que requieren autenticación
 */
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirigir al login y guardar la ubicación para volver después
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

