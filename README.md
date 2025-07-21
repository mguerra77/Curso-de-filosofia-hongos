# Curso de Filosofía de los Hongos

Plataforma web completa para el curso "La filosofía secreta de los hongos" del Dr. Maximiliano Zeller Echenique.

## Estructura del Proyecto

### 📁 Frontend (`/frontend`)
Aplicación React + Vite con:
- Homepage informativa
- Sistema de checkout y pagos
- Autenticación de usuarios
- Plataforma de cursos con videos

**Tecnologías:** React, React Router, Tailwind CSS, Vite

### 📁 Backend (`/backend`) 
API backend para:
- Autenticación de usuarios
- Procesamiento de pagos
- Gestión de contenido del curso
- Base de datos

**Tecnologías:** (Por definir)

## Desarrollo

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
# Comandos por definir
```

## Funcionalidades

### ✅ Completadas (Frontend)
- [x] Homepage con información del curso
- [x] Sección de precios y modalidades
- [x] Información del autor
- [x] Página de checkout
- [x] Sistema de login/registro (UI)
- [x] Plataforma de videos del curso
- [x] Diseño responsive
- [x] Navegación entre páginas

### 🚧 En Progreso
- [ ] Backend API
- [ ] Base de datos
- [ ] Integración con pasarelas de pago
- [ ] Sistema de autenticación real
- [ ] Gestión de contenido dinámico

## Autor
Martin Guerra Echenique

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
