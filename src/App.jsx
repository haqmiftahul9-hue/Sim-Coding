import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/admin/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="lg:pl-[260px] flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* Halaman lain akan ditambahkan di sini */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
