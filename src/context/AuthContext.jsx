import { createContext, useContext, useState, useEffect } from 'react'
import { accountService } from '../services/accountService'
import { studentService } from '../services/studentService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('simcoding_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        const freshUser = accountService.getById(user.id)
        if (freshUser && freshUser.status === 'aktif') {
          const { password: _, ...userWithoutPassword } = freshUser
          setCurrentUser(userWithoutPassword)
          if (freshUser.role === 'siswa' && freshUser.student_id) {
            const student = studentService.getById(freshUser.student_id)
            setCurrentStudent(student)
          }
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
    const accounts = accountService.getAll()

    console.log('ALL ACCOUNTS', accounts)
    console.log('USERNAME INPUT', username)
    console.log('PASSWORD INPUT', password)
    console.log('ROLE INPUT', role)

    const user = accounts.find((u) => {
      const usernameMatch = u.username === username
      const passwordMatch = u.password === password

      if (role === 'admin') {
        return usernameMatch && passwordMatch && (u.role === 'admin' || u.role === 'guru')
      }
      return usernameMatch && passwordMatch && u.role === role
    })

    console.log('MATCH USER', user)

    if (!user) {
      return { success: false, message: 'Username atau password salah' }
    }

    if (user.status === 'nonaktif') {
      return { success: false, message: 'Akun Anda tidak aktif. Hubungi administrator.' }
    }

    const { password: _, ...userWithoutPassword } = user
    setCurrentUser(userWithoutPassword)
    localStorage.setItem('simcoding_user', JSON.stringify(userWithoutPassword))

    if (user.role === 'siswa' && user.student_id) {
      const student = studentService.getById(user.student_id)
      setCurrentStudent(student)
    }

    return { success: true, user: userWithoutPassword }
  }

  const logout = () => {
    setCurrentUser(null)
    setCurrentStudent(null)
    localStorage.removeItem('simcoding_user')
  }

  const isAdmin = () => currentUser?.role === 'admin' || currentUser?.role === 'guru'
  const isStudent = () => currentUser?.role === 'siswa'
  const isGuru = () => currentUser?.role === 'guru'

  const value = {
    currentUser,
    currentStudent,
    login,
    logout,
    isAdmin,
    isStudent,
    isGuru,
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
