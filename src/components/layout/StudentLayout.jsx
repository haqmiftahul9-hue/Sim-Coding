import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Fingerprint, ClipboardList, Award, LogOut, Code } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/student/dashboard' },
  { id: 'presensi', label: 'Presensi', icon: Fingerprint, to: '/student/presensi' },
  { id: 'tugas', label: 'Tugas', icon: ClipboardList, to: '/student/tugas' },
  { id: 'nilai', label: 'Nilai', icon: Award, to: '/student/nilai' },
]

export default function StudentLayout({ children }) {
  const { currentStudent, currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
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
      {/* Sidebar */}
      <aside className="w-[260px] h-screen fixed left-0 top-0 bg-[#00183d] z-20 flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
            <Code className="h-5 w-5 text-[#9bbbff]" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">SimCoding</h1>
            <p className="text-xs text-white/60">Student Portal</p>
          </div>
        </div>

        {/* User Info with Photo */}
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

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border-l-3 border-[#9bbbff]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white w-full transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
