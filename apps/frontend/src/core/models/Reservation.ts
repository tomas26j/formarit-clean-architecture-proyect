export interface Reservation {
  id: string
  hotelId: string
  habitacionId: string
  checkIn: Date
  checkOut: Date
  huesped: {
    nombre: string
    email: string
    telefono: string
  }
  medioPago: string
  estado: 'pendiente' | 'confirmada' | 'cancelada'
  precioTotal: number
}

