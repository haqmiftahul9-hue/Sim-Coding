import { CheckCircle2 } from 'lucide-react'

export default function SuccessModal({
  open,
  onClose,
  title = 'Berhasil Disimpan',
  description,
  actionLabel = 'Kembali ke Dashboard',
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 max-w-[420px] w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-xl flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,24,61,0.08)]"
      >
        <div className="w-2xl h-2xl rounded-full bg-secondary-container/20 border border-secondary-container/30 flex items-center justify-center mb-md relative">
          <div
            className="absolute inset-0 rounded-full bg-secondary-container opacity-20 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <CheckCircle2 className="w-16 h-16 text-secondary relative z-10" strokeWidth={1.5} />
        </div>

        <h1 className="font-headline-md text-headline-md text-on-surface mb-sm">
          {title}
        </h1>

        {description && (
          <p className="font-body-md text-body-md text-on-surface-variant mb-xl leading-relaxed">
            {description}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary text-on-primary font-label-md text-label-md h-12 rounded-lg flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-all duration-200 border-t border-white/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
