import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import '../App.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token no válido. Solicita un nuevo enlace de restablecimiento.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (!password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token, 
          password: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Intenta nuevamente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="success-section">
            <div className="success-icon">✅</div>
            <h2>¡Contraseña restablecida!</h2>
            <p className="success-message">
              Tu contraseña ha sido actualizada exitosamente.
            </p>
            <p>Serás redirigido al login en unos segundos...</p>
            <div className="auth-links">
              <Link to="/login">Ir al login ahora</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Restablecer contraseña</h2>
        <p className="auth-subtitle">
          Ingresa tu nueva contraseña para tu cuenta.
        </p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">Nueva contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu nueva contraseña"
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading || !token}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login">← Volver al login</Link>
          <Link to="/forgot-password">Solicitar nuevo enlace</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
