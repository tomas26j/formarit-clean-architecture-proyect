export interface Room {
  id: string
  hotelId: string
  tipo: string
  descripcion?: string
  capacidad: number
  precioPorNoche: number
  imagenUrl?: string
  amenidades?: string[]
}

