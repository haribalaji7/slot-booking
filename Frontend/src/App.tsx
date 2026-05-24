import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PublicOffersPage from './pages/PublicOffersPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminOffersPage from './pages/AdminOffersPage'
import AdminBookingsPage from './pages/AdminBookingsPage'
import SlotManagementPage from './pages/SlotManagementPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicOffersPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="offers/:id/slots" element={<SlotManagementPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
