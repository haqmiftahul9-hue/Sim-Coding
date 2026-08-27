import { useState } from 'react'
import { Eye, Loader2, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ReportPreviewButton({ student }) {
  const navigate = useNavigate()
  const [isNavigating, setIsNavigating] = useState(false)

  const handlePreview = () => {
    setIsNavigating(true)
    navigate(`/admin/rapor/${student.id}`)
  }

  return (
    <button
      type="button"
      onClick={handlePreview}
      disabled={isNavigating}
      className="rounded-lg p-2 text-slate-400 hover:bg-brand/10 hover:text-brand transition-colors disabled:opacity-50"
      title="Preview"
    >
      {isNavigating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  )
}
