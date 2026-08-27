import { useState, useEffect } from 'react'
import { X, UserPlus, Edit3 } from 'lucide-react'
import { roleOptions } from '../../Data/settingsData'

export default function AdminModal({ onClose, onSave, admin = null }) {
  const isEdit = !!admin

  const [form, setForm] = useState({
    nama: '',
    email: '',
    role: 'Guru Coding',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (admin) {
      setForm({
        nama: admin.nama,
        email: admin.email,
        role: admin.role,
      })
    }
  }, [admin])

  const validate = () => {
    const newErrors = {}
    if (!form.nama.trim()) {
      newErrors.nama = 'Nama tidak boleh kosong'
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong'
    }
    if (!form.role) {
      newErrors.role = 'Role harus dipilih'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ ...form, id: admin?.id })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border p-4">
          <div className="flex items-center gap-2">
            {isEdit ? (
              <Edit3 className="h-5 w-5 text-[#173E7A]" />
            ) : (
              <UserPlus className="h-5 w-5 text-[#173E7A]" />
            )}
            <h3 className="font-headline-sm text-headline-sm text-primary">
              {isEdit ? 'Edit Admin' : 'Tambah Admin'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-surface hover:text-navy transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface">Nama Lengkap</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Masukkan nama lengkap"
              className={`w-full h-11 bg-surface-container-lowest border rounded-lg px-4 font-body-md text-body-md focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none ${
                errors.nama ? 'border-error' : 'border-[#E2E8F0] focus:border-[#173E7A]'
              }`}
            />
            {errors.nama && <p className="text-xs text-error">{errors.nama}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contoh@simcoding.id"
              className={`w-full h-11 bg-surface-container-lowest border rounded-lg px-4 font-body-md text-body-md focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none ${
                errors.email ? 'border-error' : 'border-[#E2E8F0] focus:border-[#173E7A]'
              }`}
            />
            {errors.email && <p className="text-xs text-error">{errors.email}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={`w-full h-11 bg-surface-container-lowest border rounded-lg px-4 font-body-md text-body-md focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none appearance-none cursor-pointer ${
                errors.role ? 'border-error' : 'border-[#E2E8F0] focus:border-[#173E7A]'
              }`}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className="text-xs text-error">{errors.role}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 px-4 rounded-lg font-label-md text-label-md border border-[#E2E8F0] text-primary hover:bg-surface-container-low transition-colors flex items-center justify-center"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 h-11 px-4 rounded-lg font-label-md text-label-md bg-[#173E7A] text-white hover:bg-[#0f2d5c] shadow-sm transition-colors flex items-center justify-center"
            >
              {isEdit ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
