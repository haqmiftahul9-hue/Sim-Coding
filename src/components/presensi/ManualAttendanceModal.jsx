import { useEffect, useState } from 'react'
import Modal from '../common/Modal'

const emptyForm = {
  studentId: '',
  tanggal: '',
  jamMasuk: '',
  jamPulang: '',
  status: 'Hadir',
  keterangan: '',
}

const fieldClass =
  'w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400'

function toDisplayDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function ManualAttendanceModal({ open, onClose, students, onSave }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) setForm(emptyForm)
  }, [open])

  const selected = students.find((s) => String(s.id) === String(form.studentId))
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.studentId || !form.tanggal || !form.status) return
    onSave({
      nama: selected?.name ?? '',
      kelas: selected?.kelas ?? '',
      tanggal: toDisplayDate(form.tanggal),
      tanggalIso: form.tanggal,
      jamMasuk: form.jamMasuk || '-',
      jamPulang: form.jamPulang || '-',
      metode: 'Manual',
      status: form.status,
      keterangan: form.keterangan || '-',
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Manual Presensi"
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
            form="manual-attendance-form"
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
          >
            Simpan
          </button>
        </>
      }
    >
      <form id="manual-attendance-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Siswa</label>
          <select
            className={fieldClass}
            value={form.studentId}
            onChange={(e) => update('studentId', e.target.value)}
            required
          >
            <option value="">Pilih siswa...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.kelas})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Tanggal</label>
          <input
            type="date"
            className={fieldClass}
            value={form.tanggal}
            onChange={(e) => update('tanggal', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Jam Masuk</label>
            <input
              type="time"
              className={fieldClass}
              value={form.jamMasuk}
              onChange={(e) => update('jamMasuk', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Jam Pulang</label>
            <input
              type="time"
              className={fieldClass}
              value={form.jamPulang}
              onChange={(e) => update('jamPulang', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            className={fieldClass}
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            required
          >
            <option value="Hadir">Hadir</option>
            <option value="Terlambat">Terlambat</option>
            <option value="Absen">Absen</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Keterangan</label>
          <input
            type="text"
            className={fieldClass}
            value={form.keterangan}
            onChange={(e) => update('keterangan', e.target.value)}
            placeholder="Opsional"
          />
        </div>
      </form>
    </Modal>
  )
}
