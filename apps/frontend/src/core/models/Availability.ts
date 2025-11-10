import { Room } from './Room'

export interface Availability {
  hotelId: string
  checkIn: Date
  checkOut: Date
  habitaciones: Room[]
}

