import { X } from 'lucide-react'

// Modal reusable: overlay + kartu, menutup saat klik backdrop atau tombol close.
export default function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-xl bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-surface hover:text-navy"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-surface-border bg-surface px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
