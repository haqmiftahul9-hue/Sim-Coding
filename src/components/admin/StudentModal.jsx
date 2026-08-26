import { useEffect, useState } from 'react'
import Modal from '../common/Modal'

const emptyForm = {
  name: '',
  nis: '',
  kelas: '',
  gender: 'Laki-laki',
  status: 'Aktif',
  avatar: null,
}

const fieldClass =
  'w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400'

export default function StudentModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(emptyForm)
  const [preview, setPreview] = useState(null)

  // Reset form setiap modal dibuka (add = kosong, edit = isi awal).
  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        name: initial.name ?? '',
        nis: initial.nis ?? '',
        kelas: initial.kelas ?? '',
        gender: initial.gender ?? 'Laki-laki',
        status: initial.status ?? 'Aktif',
        avatar: initial.avatar ?? null,
      })
      setPreview(initial.avatar ?? null)
    } else {
      setForm(emptyForm)
      setPreview(null)
    }
  }, [open, initial])

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    update('avatar', url)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.nis.trim()) return
    onSave({
      ...form,
      name: form.name.trim(),
      nis: form.nis.trim(),
      kelas: form.kelas.trim() || '-',
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Siswa' : 'Tambah Siswa'}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            Batal
          </button>
          <button
            type="submit"
            form="student-form"
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
          >
            Simpan
          </button>
        </>
      }
    >
      <form id="student-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surface-border bg-navy/10">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-xl font-bold text-navy">
                {(form.name || '?').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <label className={labelClass}>Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-600 hover:file:bg-brand-100"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Nama</label>
          <input
            className={fieldClass}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Nama lengkap"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>NIS</label>
            <input
              className={fieldClass}
              value={form.nis}
              onChange={(e) => update('nis', e.target.value)}
              placeholder="2023xxx"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Kelas</label>
            <input
              className={fieldClass}
              value={form.kelas}
              onChange={(e) => update('kelas', e.target.value)}
              placeholder="9A"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Jenis Kelamin</label>
            <select
              className={fieldClass}
              value={form.gender}
              onChange={(e) => update('gender', e.target.value)}
            >
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={fieldClass}
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
            >
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  )
}
