import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    
    if (paymentId && status === 'approved') {
      // Opcional: verificar el estado del pago con tu backend
      setPaymentInfo({
        paymentId,
        status
      })
      
      // Redirigir al curso después de 5 segundos
      setTimeout(() => {
        navigate('/course')
      }, 5000)
    }
    
    setLoading(false)
  }, [navigate, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Verificando pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-4">
          Tu compra del curso se procesó correctamente.
        </p>
        
        {paymentInfo && (
          <div className="bg-green-50 p-4 rounded-lg mb-4 text-sm">
            <p><strong>ID de Pago:</strong> {paymentInfo.paymentId}</p>
            <p><strong>Estado:</strong> Aprobado</p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mb-6">
          Serás redirigido al curso en 5 segundos...
        </p>
        
        <div className="space-y-3">
          <Link 
            to="/course"
            className="block w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Ir al Curso Ahora
          </Link>
          <Link 
            to="/"
            className="block w-full text-gray-600 hover:text-gray-800 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
