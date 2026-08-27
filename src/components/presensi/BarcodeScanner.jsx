import { useEffect, useRef, useState, useCallback } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import { ScanLine, CheckCircle2, UserRound, Camera, CameraOff } from 'lucide-react'
import CameraPreview from './CameraPreview'

const SCAN_INTERVAL = 500

const scanPill = {
  scanning: { text: 'Memindai...', cls: 'bg-amber-50 text-amber-700' },
  success: { text: 'Berhasil', cls: 'bg-emerald-50 text-emerald-700' },
}

const camPill = {
  idle: { text: 'Kamera Siap', cls: 'bg-slate-100 text-slate-500' },
  requesting: { text: 'Mengaktifkan kamera...', cls: 'bg-amber-50 text-amber-700' },
  active: { text: 'Siap scan barcode', cls: 'bg-emerald-50 text-emerald-700' },
  error: { text: 'Izin kamera ditolak', cls: 'bg-red-50 text-red-500' },
}

export default function BarcodeScanner({ students, onScan }) {
  const [status, setStatus] = useState('idle')
  const [cameraStatus, setCameraStatus] = useState('idle')
  const [cameraOn, setCameraOn] = useState(false)
  const [result, setResult] = useState(null)
  const [scannedCode, setScannedCode] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const codeReaderRef = useRef(null)
  const scanIntervalRef = useRef(null)
  const isScanningRef = useRef(false)
  const lastScanTimeRef = useRef(0)

  const findStudentByCode = useCallback((code) => {
    return students.find(
      (s) => s.barcode === code || s.nis === code || s.id?.toString() === code
    )
  }, [students])

  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    isScanningRef.current = false
  }, [])

  const startScanning = useCallback(() => {
    if (!videoRef.current || isScanningRef.current) return

    if (!codeReaderRef.current) {
      codeReaderRef.current = new BrowserMultiFormatReader()
    }

    isScanningRef.current = true
    setStatus('scanning')

    const scanFrame = async () => {
      if (!videoRef.current || !isScanningRef.current) return

      const now = Date.now()
      if (now - lastScanTimeRef.current < SCAN_INTERVAL) return
      lastScanTimeRef.current = now

      const video = videoRef.current
      if (video.readyState < 2 || video.videoWidth === 0) return

      try {
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas')
          ctxRef.current = canvasRef.current.getContext('2d', { willReadFrequently: true })
        }
        const canvas = canvasRef.current
        const ctx = ctxRef.current

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const luminance = new Uint8ClampedArray(canvas.width * canvas.height)
        for (let i = 0; i < imageData.data.length; i += 4) {
          luminance[i >> 2] = (imageData.data[i] * 0.299 + imageData.data[i + 1] * 0.587 + imageData.data[i + 2] * 0.114)
        }

        const result = await codeReaderRef.current.decodeFromImageData(
          { data: luminance, width: canvas.width, height: canvas.height }
        )

        if (result && result.getText) {
          const code = result.getText()
          if (code !== scannedCode) {
            setScannedCode(code)
            const student = findStudentByCode(code)
            const now = new Date()
            const p = (n) => String(n).padStart(2, '0')
            const time = `${p(now.getHours())}:${p(now.getMinutes())}`

            stopScanning()

            if (student) {
              const entry = {
                nama: student.name,
                kelas: student.kelas,
                waktu: time,
                kode: code,
              }
              setResult(entry)
              setStatus('success')
              onScan?.(entry)
            } else {
              setResult({
                nama: 'Siswa tidak ditemukan',
                kelas: '-',
                waktu: time,
                kode: code,
                notFound: true,
              })
              setStatus('success')
            }
          }
        }
      } catch (err) {
        if (!(err instanceof NotFoundException)) {
          // Ignore scanning errors
        }
      }
    }

    scanIntervalRef.current = setInterval(scanFrame, SCAN_INTERVAL)
  }, [scannedCode, findStudentByCode, onScan, stopScanning])

  useEffect(() => {
    if (cameraOn && cameraStatus === 'active' && !result) {
      startScanning()
    } else if (!cameraOn) {
      stopScanning()
    }

    return () => {
      stopScanning()
    }
  }, [cameraOn, cameraStatus, result, startScanning, stopScanning])

  useEffect(() => {
    return () => {
      stopScanning()
      if (codeReaderRef.current) {
        codeReaderRef.current.reset()
        codeReaderRef.current = null
      }
    }
  }, [stopScanning])

  const resetScan = useCallback(() => {
    setResult(null)
    setScannedCode(null)
    setStatus('idle')
    isScanningRef.current = false
  }, [])

  const toggleCamera = useCallback(() => {
    setCameraOn((prev) => {
      if (prev) {
        stopScanning()
        setResult(null)
        setStatus('idle')
        setCameraStatus('idle')
      }
      return !prev
    })
  }, [stopScanning])

  const pill =
    status === 'scanning' || status === 'success' ? scanPill[status] : camPill[cameraStatus]

  return (
    <section className="card overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy">Scan Barcode Presensi</h3>
            <p className="mt-1 text-sm text-slate-500">Arahkan kamera ke barcode siswa untuk mencatat kehadiran.</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${pill.cls}`}>
            {pill.text}
          </span>
        </div>

        {/* Scanner area */}
        <div className="relative mt-5 h-72 overflow-hidden rounded-xl bg-navy">
          <CameraPreview
            active={cameraOn}
            facingMode="environment"
            onStatus={setCameraStatus}
            videoRef={videoRef}
          />

          {status !== 'success' && cameraOn && cameraStatus === 'active' && (
            <div className="absolute inset-6 rounded-lg border-2 border-brand/70">
              <div className="absolute left-3 right-3 top-[12%] h-0.5 animate-scan bg-brand shadow-[0_0_8px_#2563EB]" />
            </div>
          )}
          {status === 'scanning' && <div className="absolute inset-0 bg-brand/10" />}
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
              <ScanLine className="h-5 w-5" />
              Scan Lagi
            </button>
          )}
        </div>

        {/* Hasil scan */}
        {result && (
          <div className={`mt-5 rounded-xl border p-5 ${result.notFound ? 'border-red-200 bg-red-50' : 'border-surface-border bg-surface'}`}>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surface-border bg-navy/10">
                {result.avatar ? (
                  <img src={result.avatar} alt={result.nama} className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-7 w-7 text-navy" />
                )}
              </div>
              <div>
                <p className="font-display text-lg font-bold text-navy">{result.nama}</p>
                <p className="text-sm text-slate-500">{result.kelas}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-slate-400">Kode Terdeteksi</p>
                <p className="font-mono text-sm font-bold text-navy">{result.kode}</p>
                <p className="mt-1 text-xs text-slate-500">Waktu: {result.waktu}</p>
              </div>
            </div>
            {!result.notFound && (
              <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Barcode berhasil terbaca.
              </p>
            )}
            {result.notFound && (
              <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-500">
                Kode tidak terdaftar dalam data siswa.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
