import { useState, useRef, useEffect } from 'react'
import { Clock, Users, CheckCircle, AlertCircle, Edit3, Eye, MoreVertical, Trash2 } from 'lucide-react'

const statusConfig = {
  aktif: { label: 'Aktif', color: 'bg-emerald-100 text-emerald-700' },
  berakhir: { label: 'Berakhir', color: 'bg-slate-100 text-slate-500' },
  draft: { label: 'Draft', color: 'bg-amber-100 text-amber-700' },
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getDeadlineText(deadline) {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { text: 'Berakhir', color: 'text-slate-500' }
  if (diffDays === 0) return { text: 'Hari ini', color: 'text-error' }
  if (diffDays <= 3) return { text: `${diffDays} hari lagi`, color: 'text-amber-600' }
  return { text: formatDate(deadline), color: 'text-slate-500' }
}

export default function TaskCard({ task, taskNumber, submissionCount, gradedCount, onView, onEdit, onDelete }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const status = statusConfig[task.status] || statusConfig.draft
  const deadline = getDeadlineText(task.deadline)
  const totalStudents = 30
  const progress = totalStudents > 0 ? Math.round((submissionCount / totalStudents) * 100) : 0

  return (
    <div
      className={`bg-surface-container-lowest rounded-xl border border-[#F1F5F9] card-shadow p-6 flex flex-col ${
        task.status === 'draft' ? 'opacity-75' : ''
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-[#EFF6FF] text-[#173E7A] font-label-sm px-2.5 py-1 rounded-md">
          Tugas {taskNumber}
        </span>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 text-[#455e90] bg-surface-container p-1 rounded-full cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-[#E2E8F0] z-10 overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false)
                  onEdit(task)
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#173E7A] hover:bg-[#EFF6FF] transition-colors text-left"
              >
                <Edit3 className="h-4 w-4" />
                Edit Tugas
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false)
                  onDelete(task)
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors text-left border-t border-[#E2E8F0]"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Tugas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-headline-sm text-headline-sm text-primary mb-1 line-clamp-2">{task.judul}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{task.kelas}</p>

      {/* Deadline */}
      <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mb-6 bg-surface-container-low p-2 rounded-lg w-fit">
        <Clock className={`h-4 w-4 ${deadline.color === 'text-error' ? 'text-error' : ''}`} />
        <span className={`font-medium ${deadline.color}`}>{deadline.text}</span>
      </div>

      {/* Progress */}
      <div className="mt-auto">
        <div className="flex justify-between font-label-sm text-label-sm mb-2 text-on-surface-variant">
          <span>Progress Pengumpulan</span>
          <span className="text-primary font-bold">
            {submissionCount}/{totalStudents}
          </span>
        </div>
        <div className="w-full bg-[#E2E8F0] rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full ${task.status === 'draft' ? 'bg-outline-variant' : 'bg-[#173E7A]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Sudah Submit</span>
            <span className="font-headline-sm text-headline-sm text-primary">{submissionCount}</span>
          </div>
          <div className="flex flex-col border-l border-[#F1F5F9] pl-4">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Belum Dinilai</span>
            <span className="font-headline-sm text-headline-sm text-[#c9865b]">{gradedCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onView(task)}
            disabled={task.status === 'draft'}
            className={`flex-1 px-4 py-2 rounded-lg font-label-md text-label-md transition-colors text-center ${
              task.status === 'draft'
                ? 'bg-surface-container-lowest border border-outline text-outline cursor-not-allowed'
                : 'bg-surface-container-lowest border border-[#173E7A] text-[#173E7A] hover:bg-[#EFF6FF]'
            }`}
          >
            Lihat Pengumpulan
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="border border-[#E2E8F0] text-primary hover:bg-[#F1F5F9] p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Edit3 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
