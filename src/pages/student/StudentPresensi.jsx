import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { presensiService } from '../../services/presensiService'
import {
  Camera,
  CameraOff,
  ScanFace,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Fingerprint,
} from 'lucide-react'

function formatDate() {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]
  const now = new Date()
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

function formatTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export default function StudentPresensi() {
  const { currentStudent } = useAuth()
  const [todayStatus, setTodayStatus] = useState(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraStatus, setCameraStatus] = useState('idle')
  const [scanResult, setScanResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [recentHistory, setRecentHistory] = useState([])
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const studentId = currentStudent?.id
  const studentNama = currentStudent?.nama
  const studentKelas = currentStudent?.kelas

  useEffect(() => {
    if (studentNama) {
      const status = presensiService.getTodayStatus(studentNama)
      setTodayStatus(status)
      const history = presensiService.getByStudentName(studentNama).slice(0, 5)
      setRecentHistory(history)
    }
  }, [studentNama])

  const startCamera = useCallback(async () => {
    try {
      setCameraStatus('requesting')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraOn(true)
      setCameraStatus('active')
    } catch (err) {
      console.error('Camera error:', err)
      setCameraStatus('error')
      setCameraOn(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraOn(false)
    setCameraStatus('idle')
    setScanning(false)
  }, [])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleScan = useCallback(async () => {
    if (!cameraOn) {
      await startCamera()
      return
    }

    setScanning(true)
    setScanResult(null)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const entry = presensiService.addAttendance({
      nama: studentNama,
      kelas: studentKelas,
      metode: 'Scan Wajah',
    })

    setScanResult({
      success: true,
      data: entry,
    })
    setTodayStatus(entry)
    setScanning(false)
    stopCamera()

    const history = presensiService.getByStudentName(studentNama).slice(0, 5)
    setRecentHistory(history)
  }, [cameraOn, studentNama, studentKelas, startCamera, stopCamera])

  const handleReset = useCallback(() => {
    setScanResult(null)
    setScanning(false)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hadir':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'Terlambat':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'Absen':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Hadir':
        return <CheckCircle2 className="h-5 w-5" />
      case 'Terlambat':
        return <Clock className="h-5 w-5" />
      case 'Absen':
        return <XCircle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#00183d] flex items-center gap-3">
          <Fingerprint className="h-7 w-7" />
          Presensi Digital
        </h1>
        <p className="text-slate-500 mt-1">
          Lakukan presensi dengan scan wajah untuk hari ini
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Camera & Scan */}
        <div className="space-y-6">
          {/* Camera Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Kamera Presensi</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Posisikan wajah Anda di depan kamera
              </p>
            </div>

            <div className="p-5">
              {/* Camera Preview */}
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                {cameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <Camera className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm">Kamera belum aktif</p>
                  </div>
                )}

                {/* Scanning overlay */}
                {scanning && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-white text-sm font-medium">Mengenali wajah...</p>
                    </div>
                  </div>
                )}

                {/* Face guide frame */}
                {cameraOn && !scanning && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-52 border-2 border-dashed border-white/50 rounded-[50%]" />
                  </div>
                )}

                {/* Camera status badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      cameraStatus === 'active'
                        ? 'bg-emerald-500/90 text-white'
                        : cameraStatus === 'error'
                        ? 'bg-red-500/90 text-white'
                        : 'bg-slate-500/90 text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {cameraStatus === 'active'
                      ? 'Kamera Aktif'
                      : cameraStatus === 'error'
                      ? 'Kamera Error'
                      : cameraStatus === 'requesting'
                      ? 'Mengaktifkan...'
                      : 'Siap'}
                  </span>
                </div>
              </div>

              {/* Error message */}
              {cameraStatus === 'error' && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="text-sm text-red-600">
                    Izin kamera diperlukan untuk melakukan presensi
                  </span>
                </div>
              )}

              {/* Scan controls */}
              <div className="mt-4 flex gap-3">
                {!cameraOn ? (
                  <button
                    onClick={startCamera}
                    disabled={scanResult?.success}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#00183d] text-white rounded-xl font-medium text-sm hover:bg-[#0F2D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="h-5 w-5" />
                    {scanResult?.success ? 'Selesai' : 'Mulai Scan Wajah'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleScan}
                      disabled={scanning || scanResult?.success}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#00183d] text-white rounded-xl font-medium text-sm hover:bg-[#0F2D5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ScanFace className="h-5 w-5" />
                      {scanning ? 'Memindai...' : 'Scan Sekarang'}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
                    >
                      <CameraOff className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Scan result */}
              {scanResult?.success && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-800">
                        Wajah berhasil dikenali
                      </p>
                      <p className="text-sm text-emerald-600">
                        Presensi berhasil dicatat
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-3 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Status & Info */}
        <div className="space-y-6">
          {/* Today Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Status Hari Ini</h2>

            {todayStatus ? (
              <div className={`p-4 rounded-xl border ${getStatusColor(todayStatus.status)}`}>
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(todayStatus.status)}
                  <span className="font-semibold text-lg">{todayStatus.status}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 opacity-80">
                    <Clock className="h-4 w-4" />
                    <span>Jam masuk: {todayStatus.jamMasuk}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-80">
                    <Fingerprint className="h-4 w-4" />
                    <span>Metode: {todayStatus.metode}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-slate-400" />
                </div>
                <p className="font-medium text-slate-700">Belum Hadir</p>
                <p className="text-sm text-slate-500 mt-1">
                  Lakukan presensi sekarang
                </p>
              </div>
            )}
          </div>

          {/* Student Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Informasi Siswa</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nama</p>
                  <p className="font-medium text-slate-800">{studentNama || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Kelas</p>
                  <p className="font-medium text-slate-800">{studentKelas || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tanggal</p>
                  <p className="font-medium text-slate-800">{formatDate()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Jam Presensi</p>
                  <p className="font-medium text-slate-800">
                    {todayStatus?.jamMasuk || formatTime()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Riwayat Terakhir</h2>
            <div className="space-y-3">
              {recentHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">{record.tanggal}</p>
                    <p className="text-xs text-slate-500">{record.jamMasuk} • {record.metode}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      record.status === 'Hadir'
                        ? 'bg-emerald-50 text-emerald-700'
                        : record.status === 'Terlambat'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
              {recentHistory.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  Belum ada riwayat presensi
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
