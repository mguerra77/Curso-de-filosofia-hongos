# ⚛️ Frontend - Curso de Hongos

> Aplicación React + Vite para el curso "La filosofía secreta de los hongos"

## 🛠️ Stack Tecnológico

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server  
- **React Router** - Navegación SPA
- **Tailwind CSS** - Framework de estilos
- **Fetch API** - Comunicación con backend

## 🏗️ Arquitectura

```
frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── Header.jsx       # Navegación principal
│   │   ├── VideoPlayer.jsx  # Reproductor de videos
│   │   ├── AuthorSection.jsx # Sección del autor
│   │   └── ...              # Modales y componentes UI
│   ├── pages/               # Páginas principales
│   │   ├── HomePage.jsx     # Landing page
│   │   ├── LoginPage.jsx    # Login/Registro
│   │   ├── CoursePage.jsx   # Contenido del curso
│   │   ├── AdminPage.jsx    # Panel administración
│   │   ├── CheckoutPage.jsx # Proceso de pago
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── EmailConfirmationPage.jsx
│   ├── contexts/            # Context API
│   │   ├── AuthContext.jsx  # Estado de autenticación
│   │   └── useCourse.js     # Hook del curso
│   ├── services/            # Servicios de API
│   │   └── api.js          # Comunicación con backend
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Entry point
├── public/                  # Archivos estáticos
├── package.json            # Dependencias y scripts
└── vite.config.js         # Configuración Vite
```

## 🚀 Instalación y Desarrollo

### 1. Configurar entorno
```bash
cd frontend
npm install
```

### 2. Variables de entorno
Crear `.env.local` (opcional):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Curso de Hongos
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
# Servidor en http://localhost:5173
```

### 4. Build para producción
```bash
npm run build
npm run preview  # Preview del build
```

## 📱 Páginas y Rutas

### Públicas
- `/` - **HomePage**: Landing page con información del curso
- `/login` - **LoginPage**: Login y registro de usuarios
- `/checkout` - **CheckoutPage**: Proceso de pago MercadoPago
- `/forgot-password` - **ForgotPasswordPage**: Solicitar reset de contraseña
- `/reset-password` - **ResetPasswordPage**: Restablecer contraseña
- `/confirm-email` - **EmailConfirmationPage**: Confirmar email

### Protegidas (requieren login)
- `/course` - **CoursePage**: Contenido del curso (videos + material)
- `/admin` - **AdminPage**: Panel de administración (solo admins)
- `/restricted` - **RestrictedAccessPage**: Sin acceso al curso

### Estados de Pago
- `/payment-success` - **PaymentSuccess**: Pago exitoso
- `/payment-failure` - **PaymentFailure**: Pago fallido  
- `/payment-pending` - **PaymentPending**: Pago pendiente

## 🎨 Componentes Principales

### AuthContext
```jsx
// Estado global de autenticación
const { user, isAuthenticated, login, logout, checkCourseAccess } = useAuth();

// Verificación automática de sesión
// Persistencia con localStorage (24h)
// Auto-logout si token expira
```

### VideoPlayer
```jsx
// Reproductor personalizado para el curso
<VideoPlayer 
  videoUrl={video.video_url}
  title={video.title}
  onVideoEnd={handleVideoComplete}
/>
```

### Header
```jsx
// Navegación adaptativa
// Botones dinámicos según estado auth
// Logout y acceso a admin
```

## 🔐 Sistema de Autenticación

### Flujo de Login
```
1. Usuario ingresa credenciales
2. POST /api/auth/login
3. Recibe JWT token (24h)
4. Guarda en localStorage
5. Redirección automática
```

### Persistencia de Sesión
```jsx
// Auto-verificación al cargar app
useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Verifica validez del token
    authService.getProfile();
  }
}, []);
```

### Protección de Rutas
```jsx
// Verificación en cada página protegida
if (!isAuthenticated) {
  navigate('/login');
  return;
}

const access = await checkCourseAccess();
if (!access) {
  navigate('/restricted');
  return;
}
```

## 💰 Integración de Pagos

### MercadoPago Checkout
```jsx
// Crear preferencia de pago
const handlePayment = async () => {
  const preference = await api.createPayment({
    title: "Curso de Filosofía de Hongos",
    price: 10000, // ARS
    user_id: user.id
  });
  
  // Redireccionar a MP
  window.location.href = preference.init_point;
};
```

### Estados de Pago
- **Success**: Pago aprobado → Acceso otorgado automáticamente
- **Pending**: Esperando confirmación → Usuario notificado
- **Failure**: Pago rechazado → Opción de reintentar

## 🎨 Estilos y Tema

### Tailwind CSS
```css
/* Paleta de colores principal */
emerald-500  /* Verde principal */
teal-600     /* Verde secundario */
gray-800     /* Texto principal */
gray-600     /* Texto secundario */
```

### Componentes de UI
```jsx
// Botones estándar
className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg"

// Cards
className="bg-white rounded-xl shadow-lg p-8"

// Inputs
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
```

## 📡 Servicios de API

### authService
```javascript
// Servicios de autenticación
authService.login(credentials)           // Login
authService.register(userData)           // Registro
authService.logout()                     // Logout
authService.getProfile()                 // Perfil usuario
authService.checkCourseAccess()          // Verificar acceso
authService.confirmEmail(token)          // Confirmar email
authService.forgotPassword(email)        // Reset password
authService.resetPassword(token, pass)   // Nueva password
```

### Helper Functions
```javascript
// Headers automáticos con JWT
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
});

// Manejo de errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};
```

## 🧪 Testing y Desarrollo

### Scripts disponibles
```bash
npm run dev        # Servidor desarrollo
npm run build      # Build producción  
npm run preview    # Preview build
npm run lint       # ESLint
```

### Estructura de testing
```bash
# Para agregar tests en el futuro
frontend/
├── src/
│   └── __tests__/     # Tests unitarios
├── e2e/               # Tests end-to-end
└── cypress/           # Tests Cypress
```

## 🚀 Deployment

### Build para producción
```bash
npm run build
# Genera carpeta dist/ con archivos optimizados
```

### Variables de entorno producción
```env
VITE_API_URL=https://api.cursohongos.com/api
VITE_MP_PUBLIC_KEY=your-production-mp-key
```

### Configuración servidor
```bash
# Servir archivos estáticos
# Configurar proxy para /api/* → backend
# Habilitar history API fallback (SPA)
```

## 📱 Responsive Design

- **Mobile First**: Optimizado para móviles
- **Breakpoints**: sm, md, lg, xl (Tailwind)
- **Navigation**: Hamburguer menu en móviles
- **Video Player**: Adaptativo a pantalla

## 🔧 Configuración Vite

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // Proxy para API
    }
  }
});
```

---
⚛️ **React 18** | ⚡ **Vite 5** | 🎨 **Tailwind CSS 3** | 🛣️ **React Router 6**
