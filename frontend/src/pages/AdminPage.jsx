import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { adminService } from '../services/api'

function AdminPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState({})

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user && user.rol !== 'admin') {
      navigate('/')
      return
    }

    loadUsers()
  }, [isAuthenticated, user, navigate])

  const loadUsers = async () => {
    try {
      setError('')
      const data = await adminService.getUsers()
      setUsers(data.usuarios)
    } catch (err) {
      setError(err.message || 'Error cargando usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    setActionLoading(prev => ({ ...prev, [userId]: action }))
    
    try {
      let result
      switch (action) {
        case 'activate':
          result = await adminService.activateUser(userId)
          break
        case 'deactivate':
          result = await adminService.deactivateUser(userId)
          break
        case 'grant':
          result = await adminService.grantAccess(userId)
          break
        case 'revoke':
          result = await adminService.revokeAccess(userId)
          break
        default:
          throw new Error('Acción no válida')
      }
      
      // Actualizar el usuario en la lista local
      setUsers(prev => prev.map(u => 
        u.id === userId ? result.usuario : u
      ))
      
    } catch (err) {
      setError(err.message || 'Error realizando la acción')
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }))
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">🔧 Panel de Administración</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-200">👨‍💼 {user?.nombre} {user?.apellido}</span>
            <Link
              to="/course"
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              Ver Curso
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Usuarios</h3>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Usuarios Activos</h3>
            <p className="text-2xl font-bold text-emerald-600">
              {users.filter(u => u.activo).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Con Acceso al Curso</h3>
            <p className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.has_access).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Administradores</h3>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.rol === 'admin').length}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de usuarios */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acceso Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                          <div className="text-sm text-gray-500">{usuario.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.has_access 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usuario.has_access ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.rol === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {usuario.rol !== 'admin' && (
                        <>
                          {/* Botón Activar/Desactivar */}
                          <button
                            onClick={() => handleUserAction(
                              usuario.id, 
                              usuario.activo ? 'deactivate' : 'activate'
                            )}
                            disabled={actionLoading[usuario.id]}
                            className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium transition-colors ${
                              usuario.activo
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {actionLoading[usuario.id] === (usuario.activo ? 'deactivate' : 'activate') ? (
                              '⏳'
                            ) : (
                              usuario.activo ? 'Desactivar' : 'Activar'
                            )}
                          </button>

                          {/* Botón Dar/Quitar Acceso */}
                          <button
                            onClick={() => handleUserAction(
                              usuario.id, 
                              usuario.has_access ? 'revoke' : 'grant'
                            )}
                            disabled={actionLoading[usuario.id]}
                            className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium transition-colors ${
                              usuario.has_access
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {actionLoading[usuario.id] === (usuario.has_access ? 'revoke' : 'grant') ? (
                              '⏳'
                            ) : (
                              usuario.has_access ? 'Quitar Acceso' : 'Dar Acceso'
                            )}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
