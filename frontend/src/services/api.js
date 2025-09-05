// Configuración base de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Helper para manejar errores de respuesta
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Helper para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Servicios de autenticación
export const authService = {
  // Registrar nuevo usuario
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    
    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
    }
    
    return data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Verificar acceso al curso
  checkCourseAccess: async () => {
    const response = await fetch(`${API_BASE_URL}/course/check-access`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Obtener usuario actual desde localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si hay token válido
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Confirmar email
  confirmEmail: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/confirm-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    return handleResponse(response);
  },

  // Reenviar confirmación de email
  resendConfirmation: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/resend-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Solicitar reset de contraseña
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Restablecer contraseña
  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password: newPassword }),
    });
    return handleResponse(response);
  }
};

// Servicios del curso
export const courseService = {
  // Verificar acceso al curso
  checkAccess: async () => {
    const response = await fetch(`${API_BASE_URL}/course/check-access`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Obtener contenido del curso
  getContent: async () => {
    const response = await fetch(`${API_BASE_URL}/course/content`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Actualizar contenido de video
  updateVideo: async (videoId, videoData) => {
    const response = await fetch(`${API_BASE_URL}/course/content/${videoId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(videoData),
    });
    return handleResponse(response);
  },

  // Subir video
  uploadVideo: async (formData, videoId = null) => {
    const token = localStorage.getItem('authToken');
    const url = videoId 
      ? `${API_BASE_URL}/course/upload-video/${videoId}`
      : `${API_BASE_URL}/course/upload-video`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData,
    });
    return handleResponse(response);
  }
};

// Servicios de pagos
export const paymentService = {
  // Crear preferencia de pago
  createPreference: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments/create-preference`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(response);
  },

  // Obtener estado del pago
  getPaymentStatus: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payments/status/${paymentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Servicios de administración (solo para admins)
export const adminService = {
  // Obtener todos los usuarios
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Activar usuario y darle acceso
  activateUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/activate-user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return handleResponse(response);
  },

  // Desactivar usuario y quitarle acceso
  deactivateUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/deactivate-user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return handleResponse(response);
  },

  // Dar acceso al curso
  grantAccess: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/grant-access`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return handleResponse(response);
  },

  // Revocar acceso al curso
  revokeAccess: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/revoke-access`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return handleResponse(response);
  }
};

// Verificar estado del backend
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    return handleResponse(response);
  } catch {
    throw new Error('No se puede conectar con el servidor');
  }
};

// Exportaciones individuales para fácil acceso
export const { register, login, logout, getProfile, checkCourseAccess, getCurrentUser, isAuthenticated, confirmEmail, resendConfirmation, forgotPassword, resetPassword } = authService;
export const { checkAccess, getContent, updateVideo, uploadVideo } = courseService;
export const { createPreference, getPaymentStatus } = paymentService;
export const { getUsers, activateUser, deactivateUser, grantAccess, revokeAccess } = adminService;
