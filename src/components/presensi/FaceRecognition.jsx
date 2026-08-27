import { useEffect, useRef, useState, useCallback } from 'react'
import * as faceapi from 'face-api.js'

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model'
const DETECTION_INTERVAL = 500

const RECOGNITION_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  NO_FACE: 'no_face',
  FACE_DETECTED: 'face_detected',
  RECOGNIZING: 'recognizing',
  MATCHED: 'matched',
  NO_MATCH: 'no_match',
}

export default function FaceRecognition({ videoRef, active, onRecognitionComplete, onStatusChange }) {
  const [recognitionState, setRecognitionState] = useState(RECOGNITION_STATES.IDLE)
  const [faces, setFaces] = useState([])
  const [confidence, setConfidence] = useState(0)
  const detectorRef = useRef(null)
  const intervalRef = useRef(null)
  const lastDetectionTimeRef = useRef(0)
  const isProcessingRef = useRef(false)
  const lastStateRef = useRef(RECOGNITION_STATES.IDLE)
  const facesRef = useRef([])
  const confidenceRef = useRef(0)

  const updateStateIfChanged = useCallback((newState, newFaces = null, newConfidence = null) => {
    if (lastStateRef.current !== newState) {
      lastStateRef.current = newState
      setRecognitionState(newState)
      onStatusChange?.(newState)
    }
    if (newFaces !== null && facesRef.current !== newFaces) {
      facesRef.current = newFaces
      setFaces(newFaces)
    }
    if (newConfidence !== null && confidenceRef.current !== newConfidence) {
      confidenceRef.current = newConfidence
      setConfidence(newConfidence)
    }
  }, [onStatusChange])

  const initDetector = useCallback(async () => {
    updateStateIfChanged(RECOGNITION_STATES.LOADING)

    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)

      detectorRef.current = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
      })

      updateStateIfChanged(RECOGNITION_STATES.NO_FACE)
    } catch (err) {
      console.error('Failed to initialize face recognition:', err)
      updateStateIfChanged(RECOGNITION_STATES.IDLE)
    }
  }, [updateStateIfChanged])

  const detectAndRecognize = useCallback(async () => {
    if (!videoRef.current || !active || isProcessingRef.current) return

    const video = videoRef.current
    if (video.readyState < 2 || video.videoWidth === 0) return

    const now = Date.now()
    if (now - lastDetectionTimeRef.current < DETECTION_INTERVAL) return
    lastDetectionTimeRef.current = now

    isProcessingRef.current = true

    try {
      const detection = await faceapi
        .detectSingleFace(video, detectorRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (detection) {
        const newFaces = [detection.detection]
        const newConfidence = detection.detection.score

        updateStateIfChanged(RECOGNITION_STATES.FACE_DETECTED, newFaces, newConfidence)

        if (onRecognitionComplete && lastStateRef.current === RECOGNITION_STATES.FACE_DETECTED) {
          onRecognitionComplete({
            descriptor: Array.from(detection.descriptor),
            detection: detection.detection,
            landmarks: detection.landmarks,
          })
        }
      } else {
        updateStateIfChanged(RECOGNITION_STATES.NO_FACE, [], 0)
      }
    } catch (err) {
      console.error('Detection error:', err)
    } finally {
      isProcessingRef.current = false
    }
  }, [active, onRecognitionComplete, updateStateIfChanged, videoRef])

  useEffect(() => {
    if (active) {
      initDetector()
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      updateStateIfChanged(RECOGNITION_STATES.IDLE, [], 0)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [active, initDetector, updateStateIfChanged])

  useEffect(() => {
    if (active && detectorRef.current) {
      intervalRef.current = setInterval(detectAndRecognize, DETECTION_INTERVAL)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [active, detectAndRecognize])

  const startRecognition = useCallback(() => {
    isProcessingRef.current = false
    updateStateIfChanged(RECOGNITION_STATES.RECOGNIZING)
  }, [updateStateIfChanged])

  const resetRecognition = useCallback(() => {
    isProcessingRef.current = false
    updateStateIfChanged(RECOGNITION_STATES.NO_FACE, [], 0)
  }, [updateStateIfChanged])

  const getBoundingBoxStyle = (box) => {
    const video = videoRef.current
    if (!video) return {}

    const videoWidth = video.videoWidth || 640
    const videoHeight = video.videoHeight || 480
    const displayWidth = video.clientWidth || 640
    const displayHeight = video.clientHeight || 480

    const scaleX = displayWidth / videoWidth
    const scaleY = displayHeight / videoHeight

    return {
      left: `${box.x * scaleX}px`,
      top: `${box.y * scaleY}px`,
      width: `${box.width * scaleX}px`,
      height: `${box.height * scaleY}px`,
    }
  }

  const getStatusText = () => {
    switch (recognitionState) {
      case RECOGNITION_STATES.LOADING:
        return 'Memuat model pengenalan wajah...'
      case RECOGNITION_STATES.NO_FACE:
        return 'Mencari wajah...'
      case RECOGNITION_STATES.FACE_DETECTED:
        return 'Wajah terdeteksi'
      case RECOGNITION_STATES.RECOGNIZING:
        return 'Mengenali wajah...'
      case RECOGNITION_STATES.MATCHED:
        return 'Wajah berhasil dikenali'
      case RECOGNITION_STATES.NO_MATCH:
        return 'Wajah tidak dikenali'
      default:
        return ''
    }
  }

  const getStatusColor = () => {
    switch (recognitionState) {
      case RECOGNITION_STATES.LOADING:
        return 'bg-amber-500'
      case RECOGNITION_STATES.NO_FACE:
        return 'bg-slate-400'
      case RECOGNITION_STATES.FACE_DETECTED:
        return 'bg-emerald-500'
      case RECOGNITION_STATES.RECOGNIZING:
        return 'bg-blue-500'
      case RECOGNITION_STATES.MATCHED:
        return 'bg-emerald-500'
      case RECOGNITION_STATES.NO_MATCH:
        return 'bg-red-500'
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
            recognitionState === RECOGNITION_STATES.RECOGNIZING || recognitionState === RECOGNITION_STATES.MATCHED
              ? 'border-blue-400 animate-pulse'
              : recognitionState === RECOGNITION_STATES.NO_MATCH
              ? 'border-red-400'
              : 'border-emerald-400'
          } rounded-lg`}
          style={getBoundingBoxStyle(face.box)}
        >
          <div
            className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium text-white rounded ${
              recognitionState === RECOGNITION_STATES.RECOGNIZING || recognitionState === RECOGNITION_STATES.MATCHED
                ? 'bg-blue-500'
                : recognitionState === RECOGNITION_STATES.NO_MATCH
                ? 'bg-red-500'
                : 'bg-emerald-500'
            }`}
          >
            {recognitionState === RECOGNITION_STATES.RECOGNIZING
              ? 'Mengenali...'
              : recognitionState === RECOGNITION_STATES.MATCHED
              ? 'Dikenali'
              : recognitionState === RECOGNITION_STATES.NO_MATCH
              ? 'Tidak dikenali'
              : `${Math.round(confidence * 100)}%`}
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
        <span className={`w-2 h-2 rounded-full ${getStatusColor()} ${
          recognitionState === RECOGNITION_STATES.RECOGNIZING ? 'animate-pulse' : ''
        }`} />
        <span className="text-xs text-white font-medium">{getStatusText()}</span>
      </div>

      {recognitionState === RECOGNITION_STATES.FACE_DETECTED && (
        <button
          type="button"
          onClick={startRecognition}
          className="pointer-events-auto absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Kenali Wajah
        </button>
      )}

      {recognitionState === RECOGNITION_STATES.RECOGNIZING && (
        <button
          type="button"
          onClick={resetRecognition}
          className="pointer-events-auto absolute top-4 right-4 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Batal
        </button>
      )}
    </div>
  )
}

export { RECOGNITION_STATES }
