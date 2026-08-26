import { Eye, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

function Avatar({ student }) {
  const initial = student.name.charAt(0).toUpperCase()
  if (student.avatar) {
    return (
      <img
        src={student.avatar}
        alt={student.name}
        className="h-10 w-10 rounded-full border border-surface-border object-cover"
      />
    )
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-navy/10 font-bold text-navy">
      {initial}
    </div>
  )
}

export default function StudentTable({
  students,
  selectedIds,
  onToggle,
  onToggleAll,
  onView,
  onEdit,
  onDelete,
}) {
  const allSelected = students.length > 0 && students.every((s) => selectedIds.includes(s.id))
  const someSelected = students.some((s) => selectedIds.includes(s.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-collapse text-left">
        <thead>
          <tr className="border-b border-surface-border bg-surface font-label-sm text-label-sm uppercase tracking-wider text-slate-400">
            <th className="w-12 p-4 text-center">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded border-surface-border text-brand focus:ring-brand/30"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected
                }}
                onChange={() => onToggleAll(students.map((s) => s.id))}
              />
            </th>
            <th className="p-4 font-medium">Foto</th>
            <th className="p-4 font-medium">Nama</th>
            <th className="p-4 font-medium">NIS</th>
            <th className="p-4 font-medium">Kelas</th>
            <th className="p-4 font-medium">Jenis Kelamin</th>
            <th className="p-4 font-medium">Barcode ID</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border font-body-sm text-slate-600">
          {students.map((student) => {
            const checked = selectedIds.includes(student.id)
            return (
              <tr
                key={student.id}
                className={`transition-colors hover:bg-brand-50/40 ${checked ? 'bg-brand-50/40' : ''}`}
              >
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-surface-border text-brand focus:ring-brand/30"
                    checked={checked}
                    onChange={() => onToggle(student.id)}
                  />
                </td>
                <td className="p-4">
                  <Avatar student={student} />
                </td>
                <td className="p-4 font-semibold text-navy">{student.name}</td>
                <td className="p-4 text-slate-500">{student.nis}</td>
                <td className="p-4">{student.kelas}</td>
                <td className="p-4 text-slate-500">{student.gender}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{student.barcode}</td>
                <td className="p-4">
                  <StatusBadge status={student.status} />
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="Lihat"
                      onClick={() => onView(student)}
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-surface hover:text-navy"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEdit(student)}
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-surface hover:text-navy"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      title="Hapus"
                      onClick={() => onDelete(student)}
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
          {students.length === 0 && (
            <tr>
              <td colSpan={9} className="p-10 text-center text-sm text-slate-400">
                Tidak ada data siswa yang cocok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
