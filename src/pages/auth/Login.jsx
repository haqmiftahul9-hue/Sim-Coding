import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

function SimCodingLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="48" height="48" rx="10" fill="url(#gradient-bg)"/>
          <path d="M18 20L12 26L18 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 20L36 26L30 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27 16L21 32" stroke="url(#gradient-accent)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="36" cy="14" r="3" fill="#60a5fa"/>
          <defs>
            <linearGradient id="gradient-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e3a5f"/>
              <stop offset="1" stopColor="#2563eb"/>
            </linearGradient>
            <linearGradient id="gradient-accent" x1="21" y1="32" x2="27" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa"/>
              <stop offset="1" stopColor="#38bdf8"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-[#00183d]">SIMCODING</span>
        <span className="text-[9px] font-medium tracking-widest text-gray-500 uppercase">Sistem Informasi Coding</span>
      </div>
    </div>
  )
}

export default function Login() {
  const [role, setRole] = useState('admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Username dan password harus diisi')
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = login(username, password, role)

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/student/dashboard')
      }
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Illustration */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00183d] via-[#0F2D5C] to-[#173E7A] overflow-hidden items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl" />
        </div>

        {/* Illustration */}
        <div className="relative z-10 w-4/5 max-w-lg flex items-center justify-center">
          <img
            className="w-full h-full object-contain drop-shadow-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTVRjV0DrqyqPwqbwgR47gpg1EBYanpnSWa9gUZ1G0tlY_p9c_u9IkDRGJueEwzZ4CGhjp1UubovT8I_LKve3McNxzmaQg9TIQf_E5e9JGba_Qq6BOBZOpaAxuoSFSe0YMhtWboSalTCYL-twQU0MXZImR10Et9EgLxqoztB_XZYXu_YSsC8kSuCVwm3KWlX-gMk4mKS6hUrZKVa112lg3No6EyD1GLsVzrUJt6ELxmj4Lwl8by_YO2A"
            alt="SimCoding Illustration"
          />
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-6 left-6 z-10">
          <p className="text-sm text-white/50 font-light">
            Platform Edukasi Coding Terpadu
          </p>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-8 sm:p-10">
          {/* Logo */}
          <div className="mb-8">
            <SimCodingLogo />
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Masuk ke SimCoding
            </h1>
            <p className="text-sm text-gray-500">
              Sistem Informasi Ekstrakurikuler Coding
            </p>
          </div>

          {/* Role Selector - Compact Segmented Control */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-6 border border-gray-200">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-[#00183d] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin / Guru
            </button>
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                role === 'student'
                  ? 'bg-[#00183d] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Siswa
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="username">
                Username atau Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#00183d]/20 focus:border-[#00183d] focus:bg-white transition-all text-sm"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="block w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#00183d]/20 focus:border-[#00183d] focus:bg-white transition-all text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#00183d] focus:ring-[#00183d]/20"
                />
                <span className="text-sm text-gray-600">Ingat saya</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-[#00183d] hover:underline">
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-[#00183d] hover:bg-[#0F2D5C] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00183d] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#00183d]/20 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Developer Credit */}
          <p className="mt-8 text-center text-xs text-gray-400">
            miftahul haq. 2026
          </p>
        </div>
      </div>
    </div>
  )
}
