import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AdminRoute, StudentRoute, PublicRoute } from './components/auth/RouteGuard'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import StudentLayout from './components/layout/StudentLayout'
import Dashboard from './pages/admin/Dashboard'
import DataSiswa from './pages/admin/DataSiswa'
import DetailSiswa from './pages/admin/DetailSiswa'
import PresensiDigital from './pages/admin/PresensiDigital'
import Penilaian from './pages/admin/Penilaian'
import TugasSiswa from './pages/admin/TugasSiswa'
import Rapor from './pages/admin/Rapor'
import RaporDetail from './pages/admin/RaporDetail'
import Pengaturan from './pages/admin/Pengaturan'
import Rekapitulasi from './pages/admin/Rekapitulasi'
import ManajemenAkun from './pages/admin/ManajemenAkun'
import Login from './pages/auth/Login'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentPresensi from './pages/student/StudentPresensi'
import StudentTugas from './pages/student/StudentTugas'
import StudentNilai from './pages/student/StudentNilai'

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="lg:pl-[260px] flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { currentUser } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <AdminRoute>
            <AdminLayout>
              <DataSiswa />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/students/:id"
        element={
          <AdminRoute>
            <AdminLayout>
              <DetailSiswa />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/akun"
        element={
          <AdminRoute>
            <AdminLayout>
              <ManajemenAkun />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/presensi"
        element={
          <AdminRoute>
            <AdminLayout>
              <PresensiDigital />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/penilaian"
        element={
          <AdminRoute>
            <AdminLayout>
              <Penilaian />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/tugas"
        element={
          <AdminRoute>
            <AdminLayout>
              <TugasSiswa />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/report"
        element={
          <AdminRoute>
            <AdminLayout>
              <Rapor />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/rapor/:id"
        element={
          <AdminRoute>
            <AdminLayout>
              <RaporDetail />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/pengaturan"
        element={
          <AdminRoute>
            <AdminLayout>
              <Pengaturan />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/rekapitulasi"
        element={
          <AdminRoute>
            <AdminLayout>
              <Rekapitulasi />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <StudentRoute>
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/presensi"
        element={
          <StudentRoute>
            <StudentLayout>
              <StudentPresensi />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/tugas"
        element={
          <StudentRoute>
            <StudentLayout>
              <StudentTugas />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/nilai"
        element={
          <StudentRoute>
            <StudentLayout>
              <StudentNilai />
            </StudentLayout>
          </StudentRoute>
        }
      />

      {/* Default redirect based on role */}
      <Route
        path="/"
        element={
          currentUser ? (
            currentUser.role === 'admin' || currentUser.role === 'guru' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
