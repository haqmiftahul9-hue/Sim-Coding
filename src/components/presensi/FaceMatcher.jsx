import * as faceapi from 'face-api.js'

const MATCH_THRESHOLD = 0.6

export const createFaceMatcher = (studentsWithDescriptors) => {
  const labeledDescriptors = studentsWithDescriptors
    .filter((student) => student.faceDescriptor && student.faceDescriptor.length > 0)
    .map((student) => {
      const descriptor = new Float32Array(student.faceDescriptor)
      return new faceapi.LabeledFaceDescriptors(student.id.toString(), [descriptor])
    })

  if (labeledDescriptors.length === 0) {
    return null
  }

  return new faceapi.FaceMatcher(labeledDescriptors, MATCH_THRESHOLD)
}

export const matchFace = (faceMatcher, descriptor) => {
  if (!faceMatcher || !descriptor) {
    return null
  }

  const queryDescriptor = new Float32Array(descriptor)
  const bestMatch = faceMatcher.findBestMatch(queryDescriptor)

  return {
    label: bestMatch.label,
    distance: bestMatch.distance,
    isMatch: bestMatch.label !== 'unknown' && bestMatch.distance < MATCH_THRESHOLD,
  }
}

export const generateDummyDescriptor = () => {
  const descriptor = []
  for (let i = 0; i < 128; i++) {
    descriptor.push(Math.random() * 2 - 1)
  }
  return descriptor
}

export const studentsWithFaceData = (students) => {
  return students.map((student, index) => ({
    ...student,
    faceDescriptor: generateDummyDescriptor(),
  }))
}

export const findStudentByLabel = (students, label) => {
  const student = students.find((s) => s.id.toString() === label)
  return student || null
}
