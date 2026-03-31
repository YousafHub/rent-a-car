import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Customer from "./pages/Customer"
import Vehicle from "./pages/Vehicle"
import Booking from "./pages/Booking"
import ProtectedRoute from "./middleware/ProtectedRoute"
import PublicRoute from "./middleware/PublicRoute"
import Home from "./pages/Home"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/customers" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
      <Route path="/customers/add" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
      <Route path="/customers/edit/:id" element={<ProtectedRoute><Customer /></ProtectedRoute>} />

      <Route path="/vehicles" element={<ProtectedRoute><Vehicle /></ProtectedRoute>} />
      <Route path="/vehicles/add" element={<ProtectedRoute><Vehicle /></ProtectedRoute>} />
      <Route path="/vehicles/edit/:id" element={<ProtectedRoute><Vehicle /></ProtectedRoute>} />

      <Route path="/bookings" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      <Route path="/bookings/add" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      <Route path="/bookings/edit/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
    </Routes>
  )
}

export default App