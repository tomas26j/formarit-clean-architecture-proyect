import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { ResultsPage } from '@/pages/ResultsPage'
import { RoomDetailPage } from '@/pages/RoomDetailPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ReservationsPage } from '@/pages/ReservationsPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const router = (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/resultados" element={<ResultsPage />} />
    <Route path="/habitacion/:id" element={<RoomDetailPage />} />
    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reservas"
      element={
        <ProtectedRoute>
          <ReservationsPage />
        </ProtectedRoute>
      }
    />
  </Routes>
)

