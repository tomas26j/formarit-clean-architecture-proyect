import { ReactNode, createContext, useState, useCallback } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer, type ToastItem } from '@/components/atoms/Toast'
import { AuthProvider } from '@/core/auth/AuthContext'

interface ProvidersProps {
  children: ReactNode
}

// Contexto para toasts
export interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

export const ToastContext = createContext<ToastContextType | null>(null)

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        // No reintentar en errores 4xx (errores del cliente)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number
          if (status >= 400 && status < 500) {
            return false
          }
        }
        // Reintentar hasta 2 veces para otros errores
        return failureCount < 2
      },
    },
    mutations: {
      retry: false, // No reintentar mutaciones por defecto
    },
  },
})

export function Providers({ children }: ProvidersProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 5000) => {
      const id = Math.random().toString(36).substring(7)
      setToasts((prev) => [...prev, { id, message, type, duration }])
    },
    []
  )

  const toastValue: ToastContextType = {
    showToast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
    warning: (message: string) => showToast(message, 'warning'),
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContext.Provider value={toastValue}>
          {children}
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

