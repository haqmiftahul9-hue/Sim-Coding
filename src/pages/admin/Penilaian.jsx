import { useState, useCallback } from 'react'
import { Download, ClipboardList, BarChart3 } from 'lucide-react'
import { tasks, studentsPenilaian, submissions, assessments as initialAssessments } from '../../Data/penilaianData'
import TaskList from '../../components/assessment/TaskList'
import StudentSubmissionList from '../../components/assessment/StudentSubmissionList'
import SubmissionDetail from '../../components/assessment/SubmissionDetail'
import AssessmentForm from '../../components/assessment/AssessmentForm'
import AssessmentSummary from '../../components/assessment/AssessmentSummary'

const tabs = [
  { id: 'tasks', label: 'Daftar Tugas', icon: ClipboardList },
  { id: 'summary', label: 'Rekap Nilai', icon: BarChart3 },
]

export default function Penilaian() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [assessmentsData, setAssessmentsData] = useState(initialAssessments)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSelectTask = useCallback((task) => {
    setSelectedTask(task)
    setSelectedStudent(null)
  }, [])

  const handleSelectStudent = useCallback((student) => {
    setSelectedStudent(student)
  }, [])

  const getSubmission = (taskId, studentId) => {
    return submissions.find((s) => s.task_id === taskId && s.student_id === studentId)
  }

  const getAssessment = (taskId, studentId) => {
    return assessmentsData.find((a) => a.task_id === taskId && a.student_id === studentId)
  }

  const handleSaveAssessment = (data) => {
    setAssessmentsData((prev) => {
      const existing = prev.findIndex(
        (a) => a.task_id === data.task_id && a.student_id === data.student_id
      )
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], ...data }
        return updated
      }
      return [...prev, { ...data, id: Date.now() }]
    })
    showNotification('Draft berhasil disimpan!')
  }

  const handlePublishAssessment = (data) => {
    setAssessmentsData((prev) => {
      const existing = prev.findIndex(
        (a) => a.task_id === data.task_id && a.student_id === data.student_id
      )
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], ...data }
        return updated
      }
      return [...prev, { ...data, id: Date.now() }]
    })
    showNotification('Nilai berhasil diterbitkan!')
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Penilaian Siswa</h2>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
            <ClipboardList className="h-[18px] w-[18px]" />
            {tasks.length} tugas aktif - Kelas {tasks[0]?.kelas}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-surface border border-outline-variant px-4 py-2 rounded-lg text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Unduh Rekap
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-surface-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-brand text-navy'
                  : 'border-transparent text-slate-400 hover:text-navy'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column: Task List */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-[calc(100vh-200px)]">
            <TaskList
              tasks={tasks}
              submissions={submissions}
              assessments={assessmentsData}
              selectedTaskId={selectedTask?.id}
              onSelectTask={handleSelectTask}
            />
          </div>

          {/* Middle Column: Student Submission List */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-[calc(100vh-200px)]">
            <StudentSubmissionList
              task={selectedTask}
              students={studentsPenilaian}
              submissions={submissions}
              assessments={assessmentsData}
              selectedStudentId={selectedStudent?.id}
              onSelectStudent={handleSelectStudent}
            />
          </div>

          {/* Right Column: Assessment Workspace */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Submission Preview Card */}
            {selectedStudent && selectedTask && (
              <SubmissionDetail
                student={selectedStudent}
                submission={getSubmission(selectedTask.id, selectedStudent.id)}
              />
            )}

            {/* Grading Form */}
            <AssessmentForm
              student={selectedStudent}
              task={selectedTask}
              submission={selectedStudent && selectedTask ? getSubmission(selectedTask.id, selectedStudent.id) : null}
              assessment={selectedStudent && selectedTask ? getAssessment(selectedTask.id, selectedStudent.id) : null}
              onSave={handleSaveAssessment}
              onPublish={handlePublishAssessment}
            />

            {/* Actions Bottom Bar */}
            {selectedStudent && selectedTask && getSubmission(selectedTask.id, selectedStudent.id)?.file && (
              <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] p-4 flex justify-end gap-3 sticky bottom-4 z-10">
                <button
                  type="button"
                  onClick={() => {
                    const assessment = getAssessment(selectedTask.id, selectedStudent.id)
                    handleSaveAssessment({
                      ...assessment,
                      student_id: selectedStudent.id,
                      task_id: selectedTask.id,
                      status: 'draft',
                    })
                  }}
                  className="bg-surface border border-outline-variant px-6 py-2 rounded-lg text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm"
                >
                  Simpan Draft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const assessment = getAssessment(selectedTask.id, selectedStudent.id)
                    handlePublishAssessment({
                      ...assessment,
                      student_id: selectedStudent.id,
                      task_id: selectedTask.id,
                      status: 'published',
                    })
                  }}
                  className="bg-secondary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md shadow-sm border-t border-white/20 hover:bg-primary transition-colors flex items-center gap-2"
                >
                  Terbitkan Nilai
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <AssessmentSummary
          students={studentsPenilaian}
          tasks={tasks}
          assessments={assessmentsData}
        />
      )}
    </div>
  )
}
