import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { ResultsPage } from '@/pages/ResultsPage'
import { RoomDetailPage } from '@/pages/RoomDetailPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ReservationsPage } from '@/pages/ReservationsPage'

export const router = (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/resultados" element={<ResultsPage />} />
    <Route path="/habitacion/:id" element={<RoomDetailPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/reservas" element={<ReservationsPage />} />
  </Routes>
)

