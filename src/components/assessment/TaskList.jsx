import { ClipboardList, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const statusConfig = {
  published: { label: 'Dinilai', color: 'bg-emerald-500', icon: CheckCircle },
  submitted: { label: 'Terkumpul', color: 'bg-blue-500', icon: Clock },
  not_submitted: { label: 'Belum', color: 'bg-red-500', icon: AlertCircle },
}

export default function TaskList({ tasks, submissions, assessments, selectedTaskId, onSelectTask }) {
  const getTaskStats = (taskId) => {
    const taskSubmissions = submissions.filter((s) => s.task_id === taskId)
    const submitted = taskSubmissions.filter((s) => s.file !== null).length
    const graded = assessments.filter((a) => a.task_id === taskId && a.status === 'published').length
    const total = taskSubmissions.length
    return { submitted, graded, total }
  }

  return (
    <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
        <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Daftar Tugas
        </h3>
      </div>

      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {tasks.map((task) => {
          const stats = getTaskStats(task.id)
          const isSelected = selectedTaskId === task.id
          const title = task.judul_tugas || task.judul || 'Tugas'

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onSelectTask(task)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                isSelected
                  ? 'bg-primary-fixed-dim/10 border-2 border-secondary shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container-highest border-2 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`font-label-md text-label-md truncate ${isSelected ? 'text-primary font-bold' : 'text-on-surface'}`}>
                    {title}
                  </p>
                  <p className="font-label-sm text-label-sm text-outline mt-0.5 truncate">
                    {task.deskripsi}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="h-3 w-3" />
                      {stats.submitted} pengumpulan
                    </span>
                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                      {stats.graded} dinilai
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-secondary">chevron_right</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
