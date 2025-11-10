/**
 * Hook para mostrar notificaciones toast
 * Usa un contexto global para manejar los toasts
 */
import { useContext } from 'react'
import { ToastContext } from '@/app/providers'

export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    // Fallback si no hay contexto (no debería pasar)
    return {
      showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        console.log(`[${type.toUpperCase()}] ${message}`)
      },
      success: (message: string) => console.log(`[SUCCESS] ${message}`),
      error: (message: string) => console.error(`[ERROR] ${message}`),
      info: (message: string) => console.info(`[INFO] ${message}`),
      warning: (message: string) => console.warn(`[WARNING] ${message}`),
    }
  }

  return context
}

