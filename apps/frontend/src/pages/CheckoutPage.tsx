import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/atoms'
import { Input } from '@/components/atoms'
import { Select } from '@/components/atoms'
import { PriceBreakdown } from '@/components/molecules/PriceBreakdown'
import { useConfirmReservation } from '@/features/reservation/hooks/useReservations'
import { useToast } from '@/core/hooks/useToast'
import { ApiClientError } from '@/core/api/client'
import { formatCurrency } from '@/core/utils/format'

// Esquema de validación para el formulario de checkout
const checkoutSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('El email es inválido'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  metodoPago: z.enum(['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo']),
  numeroTarjeta: z.string().optional(),
  codigoSeguridad: z.string().optional(),
  fechaVencimiento: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const confirmReservation = useConfirmReservation()
  const toast = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Obtener datos de la reserva desde el estado de navegación
  const reservationId = location.state?.reservationId

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const metodoPago = watch('metodoPago')

  const onSubmit = async (data: CheckoutFormData) => {
    if (!reservationId || reservationId === 'new') {
      toast.warning('No se encontró información de la reserva. Redirigiendo...')
      setTimeout(() => navigate('/'), 2000)
      return
    }

    setIsSubmitting(true)
    try {
      await confirmReservation.mutateAsync({
        id: reservationId,
        data: {
          metodoPago: data.metodoPago,
          numeroTarjeta: data.numeroTarjeta,
          codigoSeguridad: data.codigoSeguridad,
          fechaVencimiento: data.fechaVencimiento,
        },
      })

      toast.success('Reserva confirmada exitosamente')
      
      // Navegar a página de confirmación
      setTimeout(() => {
        navigate('/reservas', { state: { success: true } })
      }, 1000)
    } catch (error) {
      console.error('Error al confirmar reserva:', error)
      
      if (error instanceof ApiClientError) {
        toast.error(error.message || 'Error al confirmar la reserva')
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocurrió un error inesperado al confirmar la reserva')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  // Valores temporales para el desglose de precios
  const subtotal = 10000 // TODO: Obtener del estado o de la reserva
  const impuestos = subtotal * 0.21
  const total = subtotal + impuestos

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
          ← Volver
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Confirmar reserva</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información del huésped */}
                <div className="card bg-base-100 p-6">
                  <h2 className="text-xl font-semibold mb-4">Información del huésped</h2>
                  <div className="space-y-4">
                    <Input
                      label="Nombre completo"
                      placeholder="Ej: Juan Pérez"
                      {...register('nombre')}
                      error={errors.nombre?.message}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      {...register('email')}
                      error={errors.email?.message}
                      required
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      placeholder="+54 11 1234-5678"
                      {...register('telefono')}
                      error={errors.telefono?.message}
                      required
                    />
                  </div>
                </div>

                {/* Método de pago */}
                <div className="card bg-base-100 p-6">
                  <h2 className="text-xl font-semibold mb-4">Método de pago</h2>
                  <div className="space-y-4">
                    <Select
                      label="Método de pago"
                      {...register('metodoPago')}
                      error={errors.metodoPago?.message}
                      required
                    >
                      <option value="">Seleccione un método</option>
                      <option value="tarjeta_credito">Tarjeta de crédito</option>
                      <option value="tarjeta_debito">Tarjeta de débito</option>
                      <option value="transferencia">Transferencia bancaria</option>
                      <option value="efectivo">Efectivo</option>
                    </Select>

                    {/* Campos de tarjeta (solo si se selecciona tarjeta) */}
                    {(metodoPago === 'tarjeta_credito' || metodoPago === 'tarjeta_debito') && (
                      <>
                        <Input
                          label="Número de tarjeta"
                          placeholder="1234 5678 9012 3456"
                          {...register('numeroTarjeta')}
                          error={errors.numeroTarjeta?.message}
                          required
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Código de seguridad"
                            placeholder="123"
                            type="password"
                            {...register('codigoSeguridad')}
                            error={errors.codigoSeguridad?.message}
                            required
                          />
                          <Input
                            label="Fecha de vencimiento"
                            placeholder="MM/AA"
                            {...register('fechaVencimiento')}
                            error={errors.fechaVencimiento?.message}
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Botón de confirmar */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={isSubmitting || confirmReservation.isPending}
                >
                  Confirmar reserva
                </Button>
              </form>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="card bg-base-100 p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                <PriceBreakdown
                  items={[
                    {
                      label: 'Habitación',
                      value: subtotal,
                    },
                  ]}
                  subtotal={subtotal}
                  impuestos={impuestos}
                  total={total}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

