import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'

const CAMERA_CONSTRAINTS = {
  width: { ideal: 640, max: 640 },
  height: { ideal: 480, max: 480 },
}

export default function CameraPreview({
  active = false,
  facingMode = 'environment',
  onStatus,
  className = '',
  videoRef,
}) {
  const innerRef = useRef(null)
  const ref = videoRef ?? innerRef
  const streamRef = useRef(null)
  const [cam, setCam] = useState('idle')
  const isStartingRef = useRef(false)

  useEffect(() => {
    if (!active) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (ref.current) {
        ref.current.srcObject = null
      }
      setCam('idle')
      onStatus?.('idle')
      return
    }

    if (isStartingRef.current) return
    if (streamRef.current) {
      setCam('active')
      onStatus?.('active')
      return
    }

    let cancelled = false
    isStartingRef.current = true

    const startStream = async () => {
      setCam('requesting')
      onStatus?.('requesting')

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('not-supported')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            ...CAMERA_CONSTRAINTS,
            facingMode,
          },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        streamRef.current = stream
        if (ref.current) {
          ref.current.srcObject = stream
        }
        setCam('active')
        onStatus?.('active')
      } catch {
        if (!cancelled) {
          setCam('error')
          onStatus?.('error')
        }
      } finally {
        isStartingRef.current = false
      }
    }

    startStream()

    return () => {
      cancelled = true
    }
  }, [active, facingMode, onStatus, ref])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [])

  return (
    <div className={`relative h-full w-full ${className}`}>
      <video ref={ref} autoPlay playsInline muted className="h-full w-full object-cover" />

      {!active && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-navy to-navy-light text-navy-light/70">
          <Camera className="h-10 w-10" />
          <span className="text-sm">Kamera belum aktif</span>
        </div>
      )}

      {active && cam === 'requesting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy/90 text-sm text-white">
          Mengaktifkan kamera...
        </div>
      )}

      {cam === 'error' && (
        <div className="absolute inset-0 flex flex items-center justify-center bg-navy/95 p-4 text-center text-sm text-white">
          Izin kamera ditolak atau kamera tidak tersedia.
        </div>
      )}
    </div>
  )
}
