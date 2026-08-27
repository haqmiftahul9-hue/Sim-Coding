import { createContext, useContext, useState, useEffect } from 'react'
import { authenticate, getUserById } from '../data/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('simcoding_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        const freshUser = getUserById(user.id)
        if (freshUser) {
          setCurrentUser(freshUser)
        } else {
          localStorage.removeItem('simcoding_user')
        }
      } catch {
        localStorage.removeItem('simcoding_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (username, password, role) => {
    const result = authenticate(username, password, role)
    if (result.success) {
      setCurrentUser(result.user)
      localStorage.setItem('simcoding_user', JSON.stringify(result.user))
      return { success: true, user: result.user }
    }
    return { success: false, message: result.message }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('simcoding_user')
  }

  const isAdmin = () => currentUser?.role === 'admin'
  const isStudent = () => currentUser?.role === 'student'

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isStudent,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
