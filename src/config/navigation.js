import {
  LayoutDashboard,
  Users,
  Fingerprint,
  ClipboardList,
  GraduationCap,
  FileText,
  FileStack,
  Settings,
} from 'lucide-react'

// Daftar menu sidebar. `to` diisi saat routing halaman sudah dibuat.
export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard', active: true },
  { id: 'students', label: 'Data Siswa', icon: Users, to: '#' },
  { id: 'attendance', label: 'Presensi Digital', icon: Fingerprint, to: '#' },
  { id: 'tasks', label: 'Tugas Siswa', icon: ClipboardList, to: '#' },
  { id: 'grading', label: 'Penilaian', icon: GraduationCap, to: '#' },
  { id: 'report', label: 'Rapor', icon: FileText, to: '#' },
  { id: 'recap', label: 'Rekapitulasi', icon: FileStack, to: '#' },
]

export const settingsItem = { id: 'settings', label: 'Pengaturan', icon: Settings, to: '#' }
