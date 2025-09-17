import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Primero cargar el usuario desde localStorage para evitar delay
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Luego verificar que el token siga siendo válido
          try {
            const profileResponse = await authService.getProfile();
            setUser(profileResponse.usuario); // Actualizar con datos frescos del servidor
          } catch (error) {
            // Si el token expiró, limpiar todo
            console.error('Token expirado:', error);
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        // Error general de autenticación
        console.error('Error verificando autenticación:', error);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.usuario);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkCourseAccess = useCallback(async () => {
    console.log('🔍 checkCourseAccess: Iniciando verificación...');
    console.log('🔍 checkCourseAccess: Token:', localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING');
    console.log('🔍 checkCourseAccess: User:', user);
    
    try {
      console.log('🔍 checkCourseAccess: Llamando a authService.checkCourseAccess()...');
      const data = await authService.checkCourseAccess();
      console.log('🔍 checkCourseAccess: Respuesta recibida:', data);
      console.log('🔍 checkCourseAccess: has_access =', data.has_access);
      return data.has_access;
    } catch (error) {
      console.error('❌ checkCourseAccess: Error verificando acceso al curso:', error);
      console.error('❌ checkCourseAccess: Error stack:', error.stack);
      return false;
    }
  }, []); // Sin dependencias porque authService es estable

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkCourseAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
