import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { tasksData, kelasOptions, statusOptions } from '../../data/tugasData'
import { studentService } from '../../services/studentService'
import { submissionService } from '../../services/submissionService'
import { gradingService } from '../../services/gradingService'
import TaskCard from '../../components/task/TaskCard'
import CreateTaskModal from '../../components/task/CreateTaskModal'
import SubmissionList from '../../components/task/SubmissionList'
import DeleteConfirmationModal from '../../components/task/DeleteConfirmationModal'
import Toast from '../../components/task/Toast'

export default function TugasSiswa() {
  const [tasks, setTasks] = useState(tasksData)
  const [submissions, setSubmissions] = useState(() => submissionService.getAll())
  const [grades, setGrades] = useState(() => gradingService.getAll())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterKelas, setFilterKelas] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [viewingTask, setViewingTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })

  useEffect(() => {
    const unsub = submissionService.subscribe((next) => setSubmissions([...next]))
    const unsubG = gradingService.subscribe((next) => setGrades([...next]))
    return () => {
      unsub && unsub()
      unsubG && unsubG()
    }
  }, [])

  const studentsData = useMemo(
    () =>
      studentService.getAll().map((s) => ({
        id: s.id,
        nama: s.nama,
        kelas: s.kelas,
        initials: s.initials,
      })),
    []
  )

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = task.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
      const matchKelas = !filterKelas || task.kelas === filterKelas || task.kelas === 'Semua Kelas'
      const matchStatus = !filterStatus || task.status === filterStatus
      return matchSearch && matchKelas && matchStatus
    })
  }, [tasks, searchQuery, filterKelas, filterStatus])

  // Get task number based on original order
  const getTaskNumber = (taskId) => {
    const index = tasks.findIndex((t) => t.id === taskId)
    return index + 1
  }

  // Get submission count for a task
  const getSubmissionCount = (taskId) => {
    return submissions.filter((s) => s.task_id === taskId && s.file).length
  }

  // Get graded count for a task
  const getGradedCount = (taskId) => {
    const submitted = submissions.filter((s) => s.task_id === taskId && s.file).length
    const graded = grades.filter((a) => a.task_id === taskId && a.status === 'published').length
    return submitted - graded
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t)))
    } else {
      const newTaskNumber = tasks.length + 1
      setTasks((prev) => [...prev, { ...taskData, modul: `Tugas ${newTaskNumber}` }])
    }
    setEditingTask(null)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowCreateModal(true)
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingTask(null)
  }

  const handleDeleteTask = (task) => {
    setDeletingTask(task)
  }

  const handleConfirmDelete = () => {
    if (!deletingTask) return

    const taskId = deletingTask.id

    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    setSubmissions((prev) => prev.filter((s) => s.task_id !== taskId))
    setGrades((prev) => prev.filter((a) => a.task_id !== taskId))

    submissionService.removeByTaskId(taskId)
    gradingService.removeByTaskId(taskId)

    setDeletingTask(null)
    setToast({ visible: true, message: 'Tugas berhasil dihapus.' })

    setTimeout(() => {
      setToast({ visible: false, message: '' })
    }, 3000)
  }

  const handleCloseDeleteModal = () => {
    setDeletingTask(null)
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
            Manajemen Tugas Siswa
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Kelola dan pantau pengumpulan tugas siswa secara terpusat
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="bg-[#173E7A] hover:bg-primary text-white px-6 py-2.5 rounded-lg font-label-md text-label-md transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          <span className="text-white">Buat Tugas Baru</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-[#F1F5F9] card-shadow flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
          <input
            type="text"
            placeholder="Cari nama tugas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-4 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="w-full md:w-48 py-2.5 px-4 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-4 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all appearance-none cursor-pointer"
          >
            {kelasOptions.map((k) => (
              <option key={k} value={k === 'Semua Kelas' ? '' : k}>{k}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 py-2.5 px-4 border border-[#E2E8F0] rounded-lg bg-surface-container-lowest focus:border-[#173E7A] focus:ring-4 focus:ring-[#EFF6FF] font-body-sm text-body-sm outline-none transition-all appearance-none cursor-pointer"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s === 'Semua Status' ? '' : s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-400">Tidak ada tugas ditemukan</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              taskNumber={getTaskNumber(task.id)}
              submissionCount={getSubmissionCount(task.id)}
              gradedCount={getGradedCount(task.id)}
              onView={setViewingTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>

      {/* Create/Edit Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}

      {/* Submission List Modal */}
      {viewingTask && (
        <SubmissionList
          task={viewingTask}
          students={studentsData}
          submissions={submissions}
          assessments={grades}
          onClose={() => setViewingTask(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTask && (
        <DeleteConfirmationModal
          task={deletingTask}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}
