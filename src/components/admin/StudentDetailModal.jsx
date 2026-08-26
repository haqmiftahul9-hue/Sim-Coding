import Modal from '../common/Modal'
import StatusBadge from '../common/StatusBadge'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border py-2.5 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-navy">{value}</span>
    </div>
  )
}

export default function StudentDetailModal({ open, onClose, student }) {
  if (!student) return null
  return (
    <Modal open={open} onClose={onClose} title="Detail Siswa" maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-surface-border bg-navy/10">
          {student.avatar ? (
            <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-2xl font-bold text-navy">
              {student.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h4 className="mt-3 font-display text-lg font-bold text-navy">{student.name}</h4>
        <div className="mt-1">
          <StatusBadge status={student.status} />
        </div>
      </div>

      <div className="mt-5">
        <Row label="NIS" value={student.nis} />
        <Row label="Kelas" value={student.kelas} />
        <Row label="Jenis Kelamin" value={student.gender} />
        <Row label="Barcode ID" value={student.barcode} />
      </div>
    </Modal>
  )
}
