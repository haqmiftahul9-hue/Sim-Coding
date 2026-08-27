import { CheckCircle, X } from 'lucide-react'

export default function Toast({ message, onClose, visible }) {
  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg">
        <CheckCircle className="h-5 w-5 shrink-0" />
        <span className="font-label-md text-label-md">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 p-1 hover:bg-emerald-700 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
