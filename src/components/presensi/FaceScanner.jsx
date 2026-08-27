import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { ScanFace, CheckCircle2, Camera, CameraOff } from 'lucide-react'
import CameraPreview from './CameraPreview'
import FaceRecognition, { RECOGNITION_STATES } from './FaceRecognition'
import FaceResultCard from './FaceResultCard'
import {
  createFaceMatcher,
  matchFace,
  studentsWithFaceData,
  findStudentByLabel,
} from './FaceMatcher'

const scanPill = {
  recognizing: { text: 'Mengenali wajah...', cls: 'bg-amber-50 text-amber-700' },
  matched: { text: 'Wajah dikenali', cls: 'bg-emerald-50 text-emerald-700' },
  noMatch: { text: 'Wajah tidak dikenali', cls: 'bg-red-50 text-red-500' },
}

const camPill = {
  idle: { text: 'Kamera Siap', cls: 'bg-slate-100 text-slate-500' },
  requesting: { text: 'Mengaktifkan kamera...', cls: 'bg-amber-50 text-amber-700' },
  active: { text: 'Kamera aktif', cls: 'bg-emerald-50 text-emerald-700' },
  error: { text: 'Izin kamera ditolak', cls: 'bg-red-50 text-red-500' },
}

function getTimeNow() {
  const now = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(now.getHours())}:${p(now.getMinutes())}`
}

function getStatusFromTime() {
  const now = new Date()
  const terlambat = now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 0)
  return terlambat ? 'Terlambat' : 'Hadir'
}

export default function FaceScanner({ students, onScan }) {
  const [status, setStatus] = useState('idle')
  const [cameraStatus, setCameraStatus] = useState('idle')
  const [cameraOn, setCameraOn] = useState(false)
  const [result, setResult] = useState(null)
  const [recognitionState, setRecognitionState] = useState(RECOGNITION_STATES.IDLE)
  const videoRef = useRef(null)
  const faceMatcherRef = useRef(null)
  const recognitionTimerRef = useRef(null)
  const isMountedRef = useRef(true)

  const studentsWithFaces = useMemo(() => studentsWithFaceData(students), [students])

  useEffect(() => {
    isMountedRef.current = true
    if (studentsWithFaces.length > 0) {
      faceMatcherRef.current = createFaceMatcher(studentsWithFaces)
    }
    return () => {
      isMountedRef.current = false
      faceMatcherRef.current = null
    }
  }, [studentsWithFaces])

  useEffect(() => {
    return () => {
      if (recognitionTimerRef.current) {
        clearTimeout(recognitionTimerRef.current)
      }
    }
  }, [])

  const handleRecognitionComplete = useCallback(
    (recognitionData) => {
      if (!isMountedRef.current) return
      if (recognitionState !== RECOGNITION_STATES.RECOGNIZING) return

      const match = matchFace(faceMatcherRef.current, recognitionData.descriptor)

      if (match && match.isMatch) {
        const student = findStudentByLabel(students, match.label)
        if (student) {
          const time = getTimeNow()
          const statusValue = getStatusFromTime()

          const entry = {
            nama: student.name,
            kelas: student.kelas,
            waktu: time,
            status: statusValue,
            metode: 'Scan Wajah',
            avatar: student.avatar,
            confidence: Math.round((1 - match.distance) * 100),
          }

          if (isMountedRef.current) {
            setResult(entry)
            setStatus('matched')
            setRecognitionState(RECOGNITION_STATES.MATCHED)
          }
          onScan?.(entry)
        }
      } else {
        if (isMountedRef.current) {
          setResult({
            nama: 'Wajah tidak dikenali',
            kelas: '-',
            waktu: getTimeNow(),
            status: 'Gagal',
            notFound: true,
          })
          setStatus('noMatch')
          setRecognitionState(RECOGNITION_STATES.NO_MATCH)
        }
      }
    },
    [recognitionState, students, onScan]
  )

  const handleRecognitionStateChange = useCallback((newState) => {
    if (isMountedRef.current) {
      setRecognitionState(newState)
    }
  }, [])

  const startRecognition = useCallback(() => {
    if (isMountedRef.current) {
      setRecognitionState(RECOGNITION_STATES.RECOGNIZING)
      setStatus('recognizing')
    }
  }, [])

  const resetScan = useCallback(() => {
    if (recognitionTimerRef.current) {
      clearTimeout(recognitionTimerRef.current)
      recognitionTimerRef.current = null
    }
    if (isMountedRef.current) {
      setResult(null)
      setStatus('idle')
      setRecognitionState(RECOGNITION_STATES.NO_FACE)
    }
  }, [])

  const toggleCamera = useCallback(() => {
    setCameraOn((prev) => {
      if (prev) {
        if (isMountedRef.current) {
          setResult(null)
          setStatus('idle')
          setRecognitionState(RECOGNITION_STATES.IDLE)
        }
      }
      return !prev
    })
  }, [])

  const getPillStatus = () => {
    if (status === 'recognizing' || status === 'matched' || status === 'noMatch') {
      return scanPill[status]
    }
    if (cameraStatus === 'active' && recognitionState === RECOGNITION_STATES.FACE_DETECTED) {
      return { text: 'Wajah terdeteksi', cls: 'bg-emerald-50 text-emerald-700' }
    }
    if (cameraStatus === 'active' && recognitionState === RECOGNITION_STATES.RECOGNIZING) {
      return scanPill.recognizing
    }
    return camPill[cameraStatus]
  }

  const pill = getPillStatus()

  return (
    <section className="card overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy">Scan Wajah Presensi</h3>
            <p className="mt-1 text-sm text-slate-500">Arahkan wajah ke kamera untuk verifikasi kehadiran.</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${pill.cls}`}>
            {pill.text}
          </span>
        </div>

        {/* Camera preview + face recognition overlay */}
        <div className="relative mt-5 h-72 overflow-hidden rounded-xl bg-navy">
          <CameraPreview
            active={cameraOn}
            facingMode="user"
            onStatus={setCameraStatus}
            videoRef={videoRef}
          />

          <FaceRecognition
            videoRef={videoRef}
            active={cameraOn}
            onRecognitionComplete={handleRecognitionComplete}
            onStatusChange={handleRecognitionStateChange}
          />

          {/* Face detection frame guide */}
          {cameraOn &&
            recognitionState !== RECOGNITION_STATES.RECOGNIZING &&
            recognitionState !== RECOGNITION_STATES.MATCHED &&
            status !== 'matched' && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  className={`h-52 w-40 rounded-[50%] border-2 border-dashed ${
                    recognitionState === RECOGNITION_STATES.FACE_DETECTED
                      ? 'border-emerald-400'
                      : 'border-brand/50'
                  } ${recognitionState === RECOGNITION_STATES.NO_FACE ? 'animate-pulse' : ''}`}
                />
              </div>
            )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleCamera}
            className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            {cameraOn ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
            {cameraOn ? 'Hentikan Kamera' : 'Aktifkan Kamera'}
          </button>
          {result && (
            <button
              type="button"
              onClick={resetScan}
              className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
            >
              <ScanFace className="h-5 w-5" />
              Scan Lagi
            </button>
          )}
          {!result && recognitionState === RECOGNITION_STATES.FACE_DETECTED && (
            <button
              type="button"
              onClick={startRecognition}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <CheckCircle2 className="h-5 w-5" />
              Kenali Wajah
            </button>
          )}
        </div>

        {/* Hasil verifikasi */}
        <FaceResultCard result={result} onClose={resetScan} />
      </div>
    </section>
  )
}
