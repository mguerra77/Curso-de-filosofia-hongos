import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

function PaymentFailure() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const status = searchParams.get('status')
  const statusDetail = searchParams.get('status_detail')

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pago No Completado</h1>
        <p className="text-gray-600 mb-4">
          Tu pago no pudo ser procesado. No se realizó ningún cargo.
        </p>
        
        {statusDetail && (
          <div className="bg-red-50 p-4 rounded-lg mb-4 text-sm">
            <p><strong>Motivo:</strong> {statusDetail}</p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mb-6">
          Puedes intentar nuevamente con otro método de pago.
        </p>
        
        <div className="space-y-3">
          <Link 
            to="/checkout"
            className="block w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Intentar de Nuevo
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

export default PaymentFailure
