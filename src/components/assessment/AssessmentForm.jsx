import { useState, useEffect, useCallback } from 'react'
import { Star, Sparkles, Layout, Brain, Pencil, Save } from 'lucide-react'

// Bobot penilaian
const PROJECT_WEIGHTS = {
  tampilan: 0.20,
  logika: 0.25,
  kreativitas: 0.15,
}

const SKILL_WEIGHTS = {
  pemahaman: 0.20,
  problem_solving: 0.20,
}

function getPredikat(score) {
  if (score >= 85) return { label: 'Sangat Baik', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  if (score >= 70) return { label: 'Baik', color: 'text-blue-600', bg: 'bg-blue-50' }
  if (score >= 60) return { label: 'Cukup', color: 'text-amber-600', bg: 'bg-amber-50' }
  return { label: 'Perlu Bimbingan', color: 'text-red-500', bg: 'bg-red-50' }
}

export default function AssessmentForm({ student, task, submission, assessment, onSave, onPublish }) {
  const [scores, setScores] = useState({
    tampilan: 0,
    logika: 0,
    kreativitas: 0,
    pemahaman: 0,
    problem_solving: 0,
  })
  const [teacherNote, setTeacherNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (assessment) {
      setScores({
        tampilan: assessment.design_score || 0,
        logika: assessment.logic_score || 0,
        kreativitas: assessment.creativity_score || 0,
        pemahaman: assessment.concept_score || 0,
        problem_solving: assessment.problem_score || 0,
      })
      setTeacherNote(assessment.teacher_note || '')
    } else {
      setScores({
        tampilan: 0,
        logika: 0,
        kreativitas: 0,
        pemahaman: 0,
        problem_solving: 0,
      })
      setTeacherNote('')
    }
  }, [assessment, student, task])

  const handleScoreChange = useCallback((field, value) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0))
    setScores((prev) => ({ ...prev, [field]: numValue }))
  }, [])

  // Kalkulasi nilai proyek (60%)
  const projectScore =
    scores.tampilan * PROJECT_WEIGHTS.tampilan +
    scores.logika * PROJECT_WEIGHTS.logika +
    scores.kreativitas * PROJECT_WEIGHTS.kreativitas

  // Kalkulasi nilai kemampuan (40%)
  const skillScore =
    scores.pemahaman * SKILL_WEIGHTS.pemahaman +
    scores.problem_solving * SKILL_WEIGHTS.problem_solving

  // Nilai akhir
  const finalScore = Math.round(projectScore + skillScore)
  const predikat = getPredikat(finalScore)

  const handleSaveDraft = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onSave?.({
      student_id: student.id,
      task_id: task.id,
      submission_id: submission?.id,
      design_score: scores.tampilan,
      logic_score: scores.logika,
      creativity_score: scores.kreativitas,
      concept_score: scores.pemahaman,
      problem_score: scores.problem_solving,
      project_score: Math.round(projectScore * 10) / 10,
      skill_score: Math.round(skillScore * 10) / 10,
      final_score: finalScore,
      teacher_note: teacherNote,
      status: 'draft',
    })
    setIsSaving(false)
  }

  const handlePublish = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onPublish?.({
      student_id: student.id,
      task_id: task.id,
      submission_id: submission?.id,
      design_score: scores.tampilan,
      logic_score: scores.logika,
      creativity_score: scores.kreativitas,
      concept_score: scores.pemahaman,
      problem_score: scores.problem_solving,
      project_score: Math.round(projectScore * 10) / 10,
      skill_score: Math.round(skillScore * 10) / 10,
      final_score: finalScore,
      teacher_note: teacherNote,
      status: 'published',
    })
    setIsSaving(false)
  }

  if (!student || !task) {
    return (
      <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
            <Save className="h-8 w-8 text-outline" />
          </div>
          <p className="text-on-surface-variant">Pilih tugas dan siswa untuk mulai menilai</p>
        </div>
      </div>
    )
  }

  if (!submission?.file) {
    return (
      <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mb-4">
            <Save className="h-8 w-8 text-on-error-container" />
          </div>
          <p className="text-on-surface-variant">{student.nama} belum mengumpulkan tugas ini</p>
          <p className="text-sm text-slate-400 mt-1">Deadline: {task.deadline}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl shadow-level-1 border border-[#F1F5F9] p-6">
      {/* Header dengan skor akhir */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-outline-variant pb-4">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-primary">Formulir Penilaian</h3>
          <p className="text-sm text-slate-500 mt-1">{task.judul_tugas}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl ${predikat.bg}`}>
            <span className={`font-bold text-sm ${predikat.color}`}>{predikat.label}</span>
          </div>
          <div className="text-right">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Skor Akhir</p>
            <p className="font-display-lg text-display-lg text-primary leading-none">
              {finalScore}
              <span className="text-headline-md text-outline">/100</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* NILAI PROYEK (60%) */}
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-label-md text-label-md text-primary mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-blue-500" />
            Nilai Proyek (60%)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputScore
              icon={<Layout className="h-4 w-4" />}
              label="Tampilan / Design"
              weight="20%"
              value={scores.tampilan}
              onChange={(v) => handleScoreChange('tampilan', v)}
            />
            <InputScore
              icon={<Brain className="h-4 w-4" />}
              label="Logika Coding"
              weight="25%"
              value={scores.logika}
              onChange={(v) => handleScoreChange('logika', v)}
            />
            <InputScore
              icon={<Sparkles className="h-4 w-4" />}
              label="Kreativitas"
              weight="15%"
              value={scores.kreativitas}
              onChange={(v) => handleScoreChange('kreativitas', v)}
            />
          </div>
        </div>

        {/* NILAI KEMAMPUAN (40%) */}
        <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100">
          <h4 className="font-label-md text-label-md text-primary mb-4 flex items-center gap-2">
            <Pencil className="h-4 w-4 text-purple-500" />
            Nilai Kemampuan (40%)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputScore
              icon={<Brain className="h-4 w-4" />}
              label="Pemahaman Konsep"
              weight="20%"
              value={scores.pemahaman}
              onChange={(v) => handleScoreChange('pemahaman', v)}
            />
            <InputScore
              icon={<Sparkles className="h-4 w-4" />}
              label="Problem Solving"
              weight="20%"
              value={scores.problem_solving}
              onChange={(v) => handleScoreChange('problem_solving', v)}
            />
          </div>
        </div>

        {/* Keterangan Predikat */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Keterangan Predikat:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600">85-100: Sangat Baik</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600">70-84: Baik</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600">60-69: Cukup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-600">0-59: Perlu Bimbingan</span>
            </div>
          </div>
        </div>

        {/* Catatan Fasilitator */}
        <div className="pt-4 border-t border-outline-variant">
          <label className="font-label-md text-label-md text-on-surface block mb-2">Catatan untuk Siswa</label>
          <textarea
            value={teacherNote}
            onChange={(e) => setTeacherNote(e.target.value)}
            placeholder="Tuliskan pesan positif dan saran untuk siswa..."
            rows={3}
            className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-body-md font-body-md focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed input-glow transition-all resize-none"
          />
        </div>
      </div>
    </div>
  )
}

function InputScore({ icon, label, weight, value, onChange }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-surface-border">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-400">{icon}</span>
        <div className="flex-1">
          <label className="font-label-sm text-label-sm text-on-surface block">{label}</label>
          <span className="text-xs text-slate-400">Bobot: {weight}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-surface border border-outline-variant rounded-lg py-2 px-3 text-body-md font-body-md text-center focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed input-glow transition-all"
        />
        <span className="text-sm text-slate-400">/100</span>
      </div>
    </div>
  )
}
