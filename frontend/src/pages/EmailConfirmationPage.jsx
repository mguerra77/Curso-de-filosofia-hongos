import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmEmail, resendConfirmation } from '../services/api';

const EmailConfirmationPage = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error, resend, registered
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirmEmail = async (token) => {
      try {
        await confirmEmail(token);
        setStatus('success');
        setMessage('¡Email confirmado exitosamente! Ya puedes acceder a tu cuenta.');
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Error confirmando email');
      }
    };

    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    // Si viene desde el registro con un mensaje
    if (location.state?.message) {
      setStatus('registered');
      setMessage(location.state.message);
      setEmail(location.state.email || '');
    } else if (token) {
      // Confirmar email automáticamente si hay token en la URL
      handleConfirmEmail(token);
    } else {
      // Si no hay token, mostrar formulario para reenvío
      setStatus('resend');
    }
  }, [location, navigate]);

  const handleResendConfirmation = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Por favor ingresa tu email');
      return;
    }

    setResending(true);
    try {
      await resendConfirmation(email);
      setStatus('success');
      setMessage('Email de confirmación reenviado. Revisa tu bandeja de entrada.');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Error reenviando confirmación');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Confirmando email...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras confirmamos tu email.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Confirmación Exitosa!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Serás redirigido al login en unos segundos...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Error de Confirmación
            </h2>
            <p className="text-red-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setStatus('resend')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Reenviar Confirmación
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Ir al Login
              </button>
            </div>
          </>
        )}

        {status === 'registered' && (
          <>
            <div className="text-blue-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Registro Exitoso!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Te hemos enviado un email a <strong>{email}</strong> con un enlace para confirmar tu cuenta.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setStatus('resend')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                ¿No recibiste el email? Reenviar
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Ir al Login
              </button>
            </div>
          </>
        )}

        {status === 'resend' && (
          <>
            <div className="text-blue-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Confirma tu Email
            </h2>
            <p className="text-gray-600 mb-6">
              Ingresa tu email para reenviar el enlace de confirmación.
            </p>
            
            <form onSubmit={handleResendConfirmation} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              
              {message && (
                <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </p>
              )}
              
              <button
                type="submit"
                disabled={resending}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Enviando...' : 'Reenviar Confirmación'}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/login')}
                className="text-green-600 hover:text-green-700 text-sm"
              >
                ¿Ya confirmaste tu email? Ir al Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
