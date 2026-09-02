import { useState, useCallback, useEffect, useMemo } from 'react'
import { Download, ClipboardList, BarChart3 } from 'lucide-react'
import { tasks as penilaianTasks, studentsPenilaian } from '../../data/penilaianData'
import { tasksData } from '../../data/tugasData'
import { studentService } from '../../services/studentService'
import { submissionService } from '../../services/submissionService'
import { gradingService } from '../../services/gradingService'
import TaskList from '../../components/assessment/TaskList'
import StudentSubmissionList from '../../components/assessment/StudentSubmissionList'
import SubmissionDetail from '../../components/assessment/SubmissionDetail'
import AssessmentForm from '../../components/assessment/AssessmentForm'
import AssessmentSummary from '../../components/assessment/AssessmentSummary'

const tabs = [
  { id: 'tasks', label: 'Daftar Tugas', icon: ClipboardList },
  { id: 'summary', label: 'Rekap Nilai', icon: BarChart3 },
]

const allTasks = penilaianTasks.length ? penilaianTasks : tasksData

export default function Penilaian() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [submissions, setSubmissions] = useState(() => submissionService.getAll())
  const [assessmentsData, setAssessmentsData] = useState(() => gradingService.getAll())
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const unsubS = submissionService.subscribe((next) => setSubmissions([...next]))
    const unsubG = gradingService.subscribe((next) => setAssessmentsData([...next]))
    return () => {
      unsubS && unsubS()
      unsubG && unsubG()
    }
  }, [])

  const students = useMemo(
    () =>
      studentService.getAll().map((s) => ({
        id: s.id,
        nama: s.nama,
        kelas: s.kelas,
        initials: s.initials,
      })),
    []
  )

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

  const persistGrade = (data, status) => {
    if (!data?.student_id || !data?.task_id) return
    const result = gradingService.upsertGrade({ ...data, status })
    if (result.success) {
      showNotification(status === 'published' ? 'Nilai berhasil diterbitkan!' : 'Draft berhasil disimpan!')
    }
  }

  const handleSaveAssessment = (data) => {
    persistGrade(data, 'draft')
  }

  const handlePublishAssessment = (data) => {
    persistGrade(data, 'published')
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Penilaian Siswa</h2>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
            <ClipboardList className="h-[18px] w-[18px]" />
            {allTasks.length} tugas - {students.length} siswa
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

      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-3 flex flex-col gap-4 h-[calc(100vh-200px)]">
            <TaskList
              tasks={allTasks}
              submissions={submissions}
              assessments={assessmentsData}
              selectedTaskId={selectedTask?.id}
              onSelectTask={handleSelectTask}
            />
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4 h-[calc(100vh-200px)]">
            <StudentSubmissionList
              task={selectedTask}
              students={students}
              submissions={submissions}
              assessments={assessmentsData}
              selectedStudentId={selectedStudent?.id}
              onSelectStudent={handleSelectStudent}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            {selectedStudent && selectedTask && (
              <SubmissionDetail
                student={selectedStudent}
                submission={getSubmission(selectedTask.id, selectedStudent.id)}
              />
            )}

            <AssessmentForm
              student={selectedStudent}
              task={selectedTask}
              submission={selectedStudent && selectedTask ? getSubmission(selectedTask.id, selectedStudent.id) : null}
              assessment={selectedStudent && selectedTask ? getAssessment(selectedTask.id, selectedStudent.id) : null}
              onSave={handleSaveAssessment}
              onPublish={handlePublishAssessment}
            />

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
          students={students}
          tasks={allTasks}
          assessments={assessmentsData}
        />
      )}
    </div>
  )
}
