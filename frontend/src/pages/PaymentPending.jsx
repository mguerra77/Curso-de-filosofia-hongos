import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

function PaymentPending() {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('payment_id')

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
        <div className="text-yellow-500 text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pago Pendiente</h1>
        <p className="text-gray-600 mb-4">
          Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.
        </p>
        
        {paymentId && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-sm">
            <p><strong>ID de Pago:</strong> {paymentId}</p>
            <p><strong>Estado:</strong> Pendiente de confirmación</p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mb-6">
          Recibirás un email cuando el pago sea confirmado.
        </p>
        
        <div className="space-y-3">
          <Link 
            to="/"
            className="block w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Volver al Inicio
          </Link>
          <Link 
            to="/checkout"
            className="block w-full text-gray-600 hover:text-gray-800 transition-colors"
          >
            Ver Opciones de Pago
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentPending
