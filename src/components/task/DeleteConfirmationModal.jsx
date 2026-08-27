import { AlertTriangle } from 'lucide-react'

export default function DeleteConfirmationModal({ task, onClose, onConfirm }) {
  if (!task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-error" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
            Hapus Tugas?
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Apakah Anda yakin ingin menghapus tugas ini? Data pengumpulan dan penilaian terkait tugas ini juga akan terhapus.
          </p>
        </div>

        {/* Task Info */}
        <div className="mx-6 mb-4 p-3 bg-surface-container-low rounded-lg border border-surface-border">
          <p className="font-label-sm text-label-sm text-on-surface-variant">{task.judul}</p>
          <p className="font-body-sm text-body-sm text-outline">{task.kelas}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-surface-border bg-surface-container-low">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg font-label-md text-label-md border border-[#E2E8F0] text-primary hover:bg-surface-container-low transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg font-label-md text-label-md bg-error text-white hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
