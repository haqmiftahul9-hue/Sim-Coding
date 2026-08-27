// Data dummy user untuk autentikasi
// Struktur siap untuk integrasi Supabase

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
    role: 'admin',
    nama: 'Ahmad Programmer, S.Kom',
    avatar: null,
  },
  {
    id: 3,
    username: 'siswa',
    email: 'siswa@simcoding.id',
    password: '123456',
    role: 'student',
    nama: 'Budi Santoso',
    kelas: '5A',
    avatar: null,
  },
  {
    id: 4,
    username: 'citra',
    email: 'citra@simcoding.id',
    password: '123456',
    role: 'student',
    nama: 'Citra Dewi',
    kelas: '5A',
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
