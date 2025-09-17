import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/api'

function DebugPage() {
  const { user, isAuthenticated, loading, checkCourseAccess } = useAuth()
  const [debugInfo, setDebugInfo] = useState({})
  const [apiTest, setApiTest] = useState({})

  useEffect(() => {
    const gatherDebugInfo = async () => {
      const info = {
        timestamp: new Date().toISOString(),
        environment: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          origin: window.location.origin,
        },
        localStorage: {
          authToken: localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING',
          user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        },
        authContext: {
          user,
          isAuthenticated,
          loading,
        }
      }

      // Test API endpoints
      const apiTests = {}
      
      try {
        console.log('🧪 Testing API endpoints...')
        
        // Test backend health
        try {
          const healthResponse = await fetch('http://localhost:5000/api/auth/health')
          apiTests.health = {
            status: healthResponse.status,
            ok: healthResponse.ok,
            data: await healthResponse.text()
          }
        } catch (err) {
          apiTests.health = { error: err.message }
        }

        // Test check-access if authenticated
        if (isAuthenticated && localStorage.getItem('authToken')) {
          try {
            console.log('🧪 Testing check-access endpoint...')
            const accessData = await authService.checkCourseAccess()
            apiTests.checkAccess = { success: true, data: accessData }
          } catch (err) {
            apiTests.checkAccess = { error: err.message, stack: err.stack }
          }

          // Test using checkCourseAccess from context
          try {
            console.log('🧪 Testing checkCourseAccess from context...')
            const contextAccess = await checkCourseAccess()
            apiTests.contextCheckAccess = { success: true, data: contextAccess }
          } catch (err) {
            apiTests.contextCheckAccess = { error: err.message, stack: err.stack }
          }
        }

        setApiTest(apiTests)
      } catch (err) {
        console.error('Error gathering API tests:', err)
      }

      setDebugInfo(info)
    }

    gatherDebugInfo()
  }, [user, isAuthenticated, loading, checkCourseAccess])

  const runManualTest = async () => {
    console.log('🔄 Running manual test...')
    try {
      const result = await checkCourseAccess()
      alert(`Manual test result: ${result}`)
    } catch (err) {
      alert(`Manual test error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">🐛 Debug Information</h1>
          
          <div className="space-y-6">
            {/* Environment Info */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">🌍 Environment</h2>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(debugInfo.environment, null, 2)}
              </pre>
            </div>

            {/* Auth Context */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">🔐 Auth Context</h2>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(debugInfo.authContext, null, 2)}
              </pre>
            </div>

            {/* Local Storage */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">💾 Local Storage</h2>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(debugInfo.localStorage, null, 2)}
              </pre>
            </div>

            {/* API Tests */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">🧪 API Tests</h2>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(apiTest, null, 2)}
              </pre>
            </div>

            {/* Manual Test Button */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">🔧 Manual Tests</h2>
              <button
                onClick={runManualTest}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Test checkCourseAccess()
              </button>
            </div>

            {/* Timestamp */}
            <div className="text-sm text-gray-500">
              Generated at: {debugInfo.timestamp}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugPage