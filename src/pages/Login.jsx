import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement Supabase auth
    // For now, just redirect to dashboard
    localStorage.setItem('authToken', 'dummy-token')
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy mb-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqf2hMxQ6SFX5ZMjnreNEmfPVBlqE-EGkXLHetoE92kAzVZ4EMMBWKJUC_f6P7umuUSLQDftEBXkXlmVfrl3WCgyWTWlbA0G0xLvUDLo6KzGltftJtJseZjOzRL1595kcRU4lndlsQc0ywHgspg2nWBplws8dQLCsAUYw67XY8DW1GdxaZNZztJ1UbKOhnKhYlh2Ou0AoeDERetD0ytuV6fNQkKX0rNqRB4UEelej2aqBtpUgW4Itj8A"
              alt="SimCoding Admin"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
            SimCoding Admin
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Masuk ke portal administrator
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg border border-[#F1F5F9] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@simcoding.id"
                  className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg pl-10 pr-4 font-body-md text-body-md focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg pl-10 pr-4 font-body-md text-body-md focus:border-[#173E7A] focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-11 px-4 rounded-lg font-label-md text-label-md bg-[#173E7A] text-white hover:bg-[#0f2d5c] shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center font-body-sm text-body-sm text-outline mt-6">
          © 2024 SimCoding - Programming For Kids
        </p>
      </div>
    </div>
  )
}
