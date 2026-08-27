import {
  LayoutDashboard,
  Users,
  Fingerprint,
  ClipboardList,
  GraduationCap,
  FileText,
  FileStack,
  Settings,
  LogOut,
  UserCog,
} from 'lucide-react'

// Daftar menu sidebar. `to` diisi saat routing halaman sudah dibuat.
export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { id: 'students', label: 'Data Siswa', icon: Users, to: '/admin/students' },
  { id: 'accounts', label: 'Manajemen Akun', icon: UserCog, to: '/admin/akun' },
  { id: 'attendance', label: 'Presensi Digital', icon: Fingerprint, to: '/admin/presensi' },
  { id: 'tasks', label: 'Tugas Siswa', icon: ClipboardList, to: '/admin/tugas' },
  { id: 'grading', label: 'Penilaian', icon: GraduationCap, to: '/admin/penilaian' },
  { id: 'report', label: 'Rapor', icon: FileText, to: '/admin/report' },
  { id: 'recap', label: 'Rekapitulasi', icon: FileStack, to: '/admin/rekapitulasi' },
  { id: 'settings', label: 'Pengaturan', icon: Settings, to: '/admin/pengaturan' },
]

export const logoutItem = { id: 'logout', label: 'Keluar', icon: LogOut }
