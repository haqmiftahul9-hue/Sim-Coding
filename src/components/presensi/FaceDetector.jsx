import { useEffect, useRef, useState, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as faceDetection from '@tensorflow-models/face-detection'

const DETECTION_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  NO_FACE: 'no_face',
  FACE_DETECTED: 'face_detected',
  VERIFYING: 'verifying',
}

export default function FaceDetector({ videoRef, active, onFaceDetected, onStatusChange }) {
  const [detectionState, setDetectionState] = useState(DETECTION_STATES.IDLE)
  const [faces, setFaces] = useState([])
  const detectorRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastDetectionTimeRef = useRef(0)

  const initDetector = useCallback(async () => {
    onStatusChange?.(DETECTION_STATES.LOADING)
    setDetectionState(DETECTION_STATES.LOADING)

    try {
      await tf.ready()
      await tf.setBackend('webgl')

      const model = faceDetection.SupportedModels.MediaPipeFaceDetector
      const detector = await faceDetection.createDetector(model, {
        runtime: 'tfjs',
        maxFaces: 1,
      })

      detectorRef.current = detector
      onStatusChange?.(DETECTION_STATES.NO_FACE)
      setDetectionState(DETECTION_STATES.NO_FACE)
    } catch (err) {
      console.error('Failed to initialize face detector:', err)
      onStatusChange?.('error')
      setDetectionState(DETECTION_STATES.IDLE)
    }
  }, [onStatusChange])

  const detectFaces = useCallback(async () => {
    if (!detectorRef.current || !videoRef.current || !active) return

    const video = videoRef.current
    if (video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(detectFaces)
      return
    }

    try {
      const now = Date.now()
      if (now - lastDetectionTimeRef.current < 100) {
        animationFrameRef.current = requestAnimationFrame(detectFaces)
        return
      }
      lastDetectionTimeRef.current = now

      const detectedFaces = await detectorRef.current.estimateFaces(video, {
        flipHorizontal: false,
      })

      if (detectedFaces.length > 0) {
        setFaces(detectedFaces)
        if (detectionState !== DETECTION_STATES.VERIFYING) {
          setDetectionState(DETECTION_STATES.FACE_DETECTED)
          onStatusChange?.(DETECTION_STATES.FACE_DETECTED)
          onFaceDetected?.(detectedFaces[0])
        }
      } else {
        setFaces([])
        if (detectionState !== DETECTION_STATES.VERIFYING) {
          setDetectionState(DETECTION_STATES.NO_FACE)
          onStatusChange?.(DETECTION_STATES.NO_FACE)
        }
      }
    } catch (err) {
      if (err.message?.includes('TensorF') || err.message?.includes('tensor')) {
        console.warn('Tensor error during detection:', err.message)
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectFaces)
  }, [active, detectionState, onFaceDetected, onStatusChange, videoRef])

  useEffect(() => {
    if (active) {
      initDetector()
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      if (detectorRef.current) {
        detectorRef.current.dispose()
        detectorRef.current = null
      }
      setFaces([])
      setDetectionState(DETECTION_STATES.IDLE)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [active, initDetector])

  useEffect(() => {
    if (active && detectorRef.current && detectionState !== DETECTION_STATES.VERIFYING) {
      animationFrameRef.current = requestAnimationFrame(detectFaces)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [active, detectionState, detectFaces])

  const startVerification = useCallback(() => {
    setDetectionState(DETECTION_STATES.VERIFYING)
    onStatusChange?.(DETECTION_STATES.VERIFYING)
  }, [onStatusChange])

  const resetDetection = useCallback(() => {
    setFaces([])
    setDetectionState(DETECTION_STATES.NO_FACE)
    onStatusChange?.(DETECTION_STATES.NO_FACE)
  }, [onStatusChange])

  const getBoundingBoxStyle = (face) => {
    const box = face.box
    const video = videoRef.current
    if (!video) return {}

    const videoWidth = video.videoWidth || 640
    const videoHeight = video.videoHeight || 480
    const displayWidth = video.clientWidth || 640
    const displayHeight = video.clientHeight || 480

    const scaleX = displayWidth / videoWidth
    const scaleY = displayHeight / videoHeight

    return {
      left: `${box.xMin * scaleX}px`,
      top: `${box.yMin * scaleY}px`,
      width: `${box.width * scaleX}px`,
      height: `${box.height * scaleY}px`,
    }
  }

  const getStatusText = () => {
    switch (detectionState) {
      case DETECTION_STATES.LOADING:
        return 'Memuat model deteksi wajah...'
      case DETECTION_STATES.NO_FACE:
        return 'Menunggu wajah...'
      case DETECTION_STATES.FACE_DETECTED:
        return 'Wajah terdeteksi'
      case DETECTION_STATES.VERIFYING:
        return 'Memproses verifikasi...'
      default:
        return ''
    }
  }

  const getStatusColor = () => {
    switch (detectionState) {
      case DETECTION_STATES.LOADING:
        return 'bg-amber-500'
      case DETECTION_STATES.NO_FACE:
        return 'bg-slate-400'
      case DETECTION_STATES.FACE_DETECTED:
        return 'bg-emerald-500'
      case DETECTION_STATES.VERIFYING:
        return 'bg-blue-500'
      default:
        return 'bg-slate-400'
    }
  }

  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0">
      {faces.map((face, index) => (
        <div
          key={index}
          className={`absolute border-2 ${
            detectionState === DETECTION_STATES.VERIFYING
              ? 'border-blue-400 animate-pulse'
              : 'border-emerald-400'
          } rounded-lg`}
          style={getBoundingBoxStyle(face)}
        >
          <div
            className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium text-white rounded ${
              detectionState === DETECTION_STATES.VERIFYING
                ? 'bg-blue-500'
                : 'bg-emerald-500'
            }`}
          >
            {detectionState === DETECTION_STATES.VERIFYING ? 'Memverifikasi' : 'Wajah'}
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
        <span className={`w-2 h-2 rounded-full ${getStatusColor()} ${
          detectionState === DETECTION_STATES.VERIFYING ? 'animate-pulse' : ''
        }`} />
        <span className="text-xs text-white font-medium">{getStatusText()}</span>
      </div>

      {detectionState === DETECTION_STATES.FACE_DETECTED && (
        <button
          type="button"
          onClick={startVerification}
          className="pointer-events-auto absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Verifikasi Wajah
        </button>
      )}

      {detectionState === DETECTION_STATES.VERIFYING && (
        <button
          type="button"
          onClick={resetDetection}
          className="pointer-events-auto absolute top-4 right-4 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Batal
        </button>
      )}
    </div>
  )
}

export { DETECTION_STATES }
