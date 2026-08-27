import { useEffect, useState, useMemo } from 'react'
import { accountService } from '../../services/accountService'
import { studentService } from '../../services/studentService'
import {
  UserCog,
  Plus,
  Search,
  Edit2,
  Key,
  Trash2,
  UserCheck,
  UserX,
  Upload,
  X,
  Check,
  AlertCircle,
  Users,
  Shield,
  GraduationCap,
} from 'lucide-react'

export default function ManajemenAkun() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('semua')
  const [statusFilter, setStatusFilter] = useState('semua')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [bulkResult, setBulkResult] = useState(null)

  useEffect(() => {
    setUsers(accountService.getAll())
    const unsubscribe = accountService.subscribe((data) => {
      setUsers([...data])
    })
    return unsubscribe
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        !search ||
        user.nama.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === 'semua' || user.role === roleFilter
      const matchStatus = statusFilter === 'semua' || user.status === statusFilter
      return matchSearch && matchRole && matchStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const stats = useMemo(() => {
    const siswa = users.filter((u) => u.role === 'siswa')
    const guru = users.filter((u) => u.role === 'guru')
    const admin = users.filter((u) => u.role === 'admin')
    const aktif = users.filter((u) => u.status === 'aktif')
    return {
      total: users.length,
      siswa: siswa.length,
      guru: guru.length,
      admin: admin.length,
      aktif: aktif.length,
      nonaktif: users.length - aktif.length,
    }
  }, [users])

  const handleToggleStatus = (userId) => {
    accountService.toggleStatus(userId)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      accountService.deleteUser(userId)
    }
  }

  const handleBulkGenerate = () => {
    const result = accountService.bulkCreateFromStudents()
    setBulkResult(result)
    setShowBulkModal(false)
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        )
      case 'guru':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap className="h-3 w-3" />
            Guru
          </span>
        )
      case 'siswa':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Users className="h-3 w-3" />
            Siswa
          </span>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    return status === 'aktif' ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <UserCheck className="h-3 w-3" />
        Aktif
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <UserX className="h-3 w-3" />
        Nonaktif
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl flex items-center gap-3">
            <UserCog className="h-7 w-7" />
            Manajemen Akun
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Kelola akun siswa, guru, dan admin
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            <Upload className="h-5 w-5" />
            Generate Massal
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
          >
            <Plus className="h-5 w-5" />
            Buat Akun
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-navy mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Siswa</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.siswa}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Guru</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.guru}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Admin</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.admin}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Aktif</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.aktif}</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Nonaktif</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.nonaktif}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
          >
            <option value="semua">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="guru">Guru</option>
            <option value="siswa">Siswa</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Bulk Result Alert */}
      {bulkResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-emerald-800">
                Berhasil membuat {bulkResult.created} akun siswa
              </p>
              {bulkResult.errors.length > 0 && (
                <div className="mt-2 text-sm text-emerald-700">
                  <p className="font-medium">Errors:</p>
                  <ul className="list-disc list-inside mt-1">
                    {bulkResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setBulkResult(null)}
              className="text-emerald-600 hover:text-emerald-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Foto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelas</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredUsers.map((user) => {
                const student = user.student_id ? studentService.getById(user.student_id) : null
                return (
                  <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-surface-border">
                        {student?.foto ? (
                          <img src={student.foto} alt={user.nama} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-slate-500">
                            {user.nama.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{user.nama}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {user.kelas || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-surface-container px-2 py-1 rounded text-slate-700">
                        {user.username}
                      </code>
                    </td>
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowEditModal(true)
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:bg-surface-container hover:text-navy transition-colors"
                          title="Edit Akun"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowResetModal(true)
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:bg-surface-container hover:text-amber-600 transition-colors"
                          title="Reset Password"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'aktif'
                              ? 'text-slate-500 hover:bg-surface-container hover:text-red-600'
                              : 'text-slate-500 hover:bg-surface-container hover:text-emerald-600'
                          }`}
                          title={user.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {user.status === 'aktif' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-surface-container hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="h-12 w-12 text-slate-300 mb-3" />
                      <p className="text-slate-500">Tidak ada akun ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateAccountModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <EditAccountModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          onSuccess={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
        />
      )}

      {/* Reset Password Modal */}
      {showResetModal && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onClose={() => {
            setShowResetModal(false)
            setSelectedUser(null)
          }}
          onSuccess={() => {
            setShowResetModal(false)
            setSelectedUser(null)
          }}
        />
      )}

      {/* Bulk Generate Modal */}
      {showBulkModal && (
        <BulkGenerateModal
          onClose={() => setShowBulkModal(false)}
          onConfirm={handleBulkGenerate}
        />
      )}
    </div>
  )
}

function CreateAccountModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama: '',
    username: '',
    password: '123456',
    role: 'siswa',
    kelas: '',
    student_id: null,
  })
  const [error, setError] = useState('')
  const students = studentService.getAll()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.nama || !form.username) {
      setError('Nama dan username harus diisi')
      return
    }

    const result = accountService.createUser({
      ...form,
      student_id: form.student_id,
    })
    if (result.success) {
      onSuccess()
    } else {
      setError(result.message)
    }
  }

  const handleStudentSelect = (studentId) => {
    const student = students.find((s) => s.id === Number(studentId))
    if (student) {
      setForm({
        ...form,
        nama: student.nama,
        kelas: student.kelas,
        student_id: student.id,
        username: student.nama.toLowerCase().replace(/\s+/g, '.'),
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-lg font-semibold text-navy">Buat Akun Baru</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
          {form.role === 'siswa' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hubungkan ke Data Siswa</label>
              <select
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                value={form.student_id || ''}
              >
                <option value="">-- Pilih Siswa --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} - {s.kelas}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
              className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
              placeholder="username_tanpa_spasi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
              placeholder="Default: 123456"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.role === 'siswa' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
              <input
                type="text"
                value={form.kelas}
                onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                placeholder="Contoh: 5A"
              />
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-surface-border rounded-lg text-sm font-medium text-slate-700 hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors"
            >
              Buat Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditAccountModal({ user, onClose, onSuccess }) {
  const [username, setUsername] = useState(user.username)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username) {
      setError('Username harus diisi')
      return
    }

    if (password && password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      return
    }

    if (password && password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    const updates = { username }
    if (password) {
      updates.password = password
    }

    const result = accountService.updateUser(user.id, updates)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-lg font-semibold text-navy">Edit Akun Siswa</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="font-medium text-emerald-800">Akun berhasil diperbarui!</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Siswa</label>
                <input
                  type="text"
                  value={user.nama}
                  disabled
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm bg-surface-container text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                  placeholder="Ulangi password baru"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm bg-surface-container text-slate-500 capitalize"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-surface-border rounded-lg text-sm font-medium text-slate-700 hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors"
                >
                  Simpan
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

function ResetPasswordModal({ user, onClose, onSuccess }) {
  const [password, setPassword] = useState('123456')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    accountService.resetPassword(user.id, password)
    setSuccess(true)
    setTimeout(() => {
      onSuccess()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-lg font-semibold text-navy">Reset Password</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="font-medium text-emerald-800">Password berhasil direset!</p>
              <p className="text-sm text-emerald-600 mt-1">Password baru: {password}</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Akun</label>
                <input
                  type="text"
                  value={`${user.nama} (@${user.username})`}
                  disabled
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm bg-surface-container text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                  placeholder="Default: 123456"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-surface-border rounded-lg text-sm font-medium text-slate-700 hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

function BulkGenerateModal({ onClose, onConfirm }) {
  const studentsWithoutAccounts = studentService.getAll().filter(
    (s) => !accountService.getAll().find((u) => u.student_id === s.id)
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-lg font-semibold text-navy">Generate Akun Massal</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Informasi</p>
                <p className="text-sm text-blue-700 mt-1">
                  Akun akan dibuat untuk semua siswa yang belum memiliki akun login.
                  Password default: <code className="bg-blue-100 px-1 rounded">123456</code>
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              Siswa tanpa akun: <span className="font-semibold text-navy">{studentsWithoutAccounts.length}</span>
            </p>
            {studentsWithoutAccounts.length > 0 && (
              <ul className="mt-2 space-y-1">
                {studentsWithoutAccounts.slice(0, 5).map((s) => (
                  <li key={s.id} className="text-sm text-slate-500">
                    • {s.nama} ({s.kelas})
                  </li>
                ))}
                {studentsWithoutAccounts.length > 5 && (
                  <li className="text-sm text-slate-400">...dan {studentsWithoutAccounts.length - 5} lainnya</li>
                )}
              </ul>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-surface-border rounded-lg text-sm font-medium text-slate-700 hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={studentsWithoutAccounts.length === 0}
              className="flex-1 px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate {studentsWithoutAccounts.length} Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
