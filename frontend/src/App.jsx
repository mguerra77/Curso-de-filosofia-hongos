import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import CoursePage from './pages/CoursePage'
import AdminPage from './pages/AdminPage'
import RestrictedAccessPage from './pages/RestrictedAccessPage'
import EmailConfirmationPage from './pages/EmailConfirmationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import PaymentPending from './pages/PaymentPending'
import DebugPage from './pages/DebugPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/restricted" element={<RestrictedAccessPage />} />
          <Route path="/confirm-email" element={<EmailConfirmationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/payment-pending" element={<PaymentPending />} />
          <Route path="/debug" element={<DebugPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
