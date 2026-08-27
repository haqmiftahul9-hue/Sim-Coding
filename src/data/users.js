// Data user untuk autentikasi multi-user
// Struktur siap untuk integrasi Supabase
// Role: admin, guru, siswa

export const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@simcoding.id',
    password: '123456',
    role: 'admin',
    nama: 'Administrator SimCoding',
    avatar: null,
  },
  {
    id: 2,
    username: 'guru',
    email: 'guru@simcoding.id',
    password: '123456',
    role: 'guru',
    nama: 'Ahmad Programmer, S.Kom',
    avatar: null,
  },
  {
    id: 3,
    username: 'siswa',
    email: 'ahmad@simcoding.id',
    password: '123456',
    role: 'siswa',
    nama: 'Ahmad Dani',
    kelas: '5A',
    student_id: 1,
    avatar: null,
  },
  {
    id: 4,
    username: 'budi',
    email: 'budi@simcoding.id',
    password: '123456',
    role: 'siswa',
    nama: 'Budi Santoso',
    kelas: '5A',
    student_id: 2,
    avatar: null,
  },
  {
    id: 5,
    username: 'citra',
    email: 'citra@simcoding.id',
    password: '123456',
    role: 'siswa',
    nama: 'Citra Dewi',
    kelas: '5A',
    student_id: 3,
    avatar: null,
  },
  {
    id: 6,
    username: 'dian',
    email: 'dian@simcoding.id',
    password: '123456',
    role: 'siswa',
    nama: 'Dian Pratama',
    kelas: '5A',
    student_id: 4,
    avatar: null,
  },
]

export const authenticate = (username, password, role) => {
  const user = users.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password &&
      u.role === role
  )

  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  }

  return { success: false, message: 'Username atau password salah' }
}

export const getUserById = (id) => {
  const user = users.find((u) => u.id === id)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export const getUserByUsername = (username) => {
  const user = users.find((u) => u.username === username || u.email === username)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}
