import { LogOut, X } from 'lucide-react'

export default function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <LogOut className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
            Keluar dari Sistem?
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Apakah Anda yakin ingin keluar dari akun ini?
          </p>
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
            className="flex-1 px-4 py-2.5 rounded-lg font-label-md text-label-md bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  )
}
