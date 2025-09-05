import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('Por favor ingresa tu email');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail(''); // Limpiar el formulario
      } else {
        setError(data.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Intenta nuevamente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>¿Olvidaste tu contraseña?</h2>
        
        {!message ? (
          <>
            <p className="auth-subtitle">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="auth-button" 
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
              </button>
            </form>
            
            <div className="auth-links">
              <Link to="/login">← Volver al login</Link>
            </div>
          </>
        ) : (
          <div className="success-section">
            <div className="success-icon">✉️</div>
            <h3>Enlace enviado</h3>
            <p className="success-message">{message}</p>
            
            <div className="auth-instructions">
              <p><strong>Próximos pasos:</strong></p>
              <ol>
                <li>Revisa tu bandeja de entrada</li>
                <li>Si no encuentras el email, revisa tu carpeta de spam</li>
                <li>Haz clic en el enlace que te enviamos</li>
                <li>Sigue las instrucciones para crear una nueva contraseña</li>
              </ol>
            </div>
            
            <div className="auth-links">
              <Link to="/login">← Volver al login</Link>
              <button 
                onClick={() => {
                  setMessage('');
                  setEmail('');
                }}
                className="link-button"
              >
                Solicitar otro enlace
              </button>
            </div>
          </div>
        )}

        {/* Advertencia de soporte */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-800">
            ¿Problemas? Comunícate con nosotros: 
            <a 
              href="mailto:espaciothaumazein@gmail.com" 
              className="font-medium text-blue-600 hover:text-blue-700 ml-1 transition-colors"
            >
              espaciothaumazein@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
