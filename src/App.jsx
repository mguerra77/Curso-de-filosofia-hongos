import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import CoursePage from './pages/CoursePage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/course" element={<CoursePage />} />
      </Routes>
    </Router>
  )
}

export default App
