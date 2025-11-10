/**
 * Utilidades para formateo de datos
 */

export function formatCurrency(amount: number, currency: string = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

