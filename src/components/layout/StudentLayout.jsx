import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Fingerprint,
  ClipboardList,
  Award,
  LogOut,
  Code,
  BookOpen,
  X,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/student/dashboard' },
  { id: 'presensi', label: 'Presensi', icon: Fingerprint, to: '/student/presensi' },
  { id: 'tugas', label: 'Tugas', icon: ClipboardList, to: '/student/tugas' },
  { id: 'nilai', label: 'Nilai', icon: Award, to: '/student/nilai' },
  { id: 'portofolio', label: 'Portofolio Saya', icon: BookOpen, to: '/student/portofolio' },
]

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <LogOut className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Yakin ingin keluar?
          </h3>
          <p className="text-sm text-slate-500">
            Sesi login kamu akan diakhiri. Data siswa, tugas, dan nilai tetap aman.
          </p>
        </div>
        <div className="flex gap-3 p-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudentLayout({ children }) {
  const { currentStudent, currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    logout()
    setShowLogoutModal(false)
    navigate('/login')
  }

  const studentName = currentStudent?.nama || currentUser?.nama || 'Siswa'
  const studentKelas = currentStudent?.kelas || currentUser?.kelas
  const studentInitials = studentName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <aside className="w-[260px] h-screen fixed left-0 top-0 bg-[#00183d] z-20 flex flex-col">
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
            <Code className="h-5 w-5 text-[#9bbbff]" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">SimCoding</h1>
            <p className="text-xs text-white/60">Student Portal</p>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
              {currentStudent?.foto ? (
                <img
                  src={currentStudent.foto}
                  alt={studentName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-white">
                  {studentInitials}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{studentName}</p>
              {studentKelas && (
                <p className="text-xs text-white/60">Kelas {studentKelas}</p>
              )}
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border-l-[3px] border-[#9bbbff]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white w-full transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-[260px] min-h-screen">
        {children}
      </main>

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  )
}
