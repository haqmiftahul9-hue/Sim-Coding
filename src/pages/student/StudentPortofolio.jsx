import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { portofolioService } from '../../services/portofolioService'
import {
  BookOpen,
  Camera,
  User,
  School,
  Hash,
  Heart,
  Star,
  Code,
  Save,
  Sparkles,
} from 'lucide-react'

function Avatar({ src, name, size = 'lg' }) {
  const initials = (name || 'S')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const dim = size === 'xl' ? 'w-28 h-28 text-3xl' : 'w-20 h-20 text-xl'
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${dim} rounded-full object-cover border-4 border-white shadow-lg`}
      />
    )
  }
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-[#00183d] to-[#3c5e9b] flex items-center justify-center text-white font-bold border-4 border-white shadow-lg`}
    >
      {initials}
    </div>
  )
}

export default function StudentPortofolio() {
  const { currentStudent, currentUser } = useAuth()
  const [data, setData] = useState({
    foto: null,
    deskripsi: '',
    hobi: '',
    citaCita: '',
    keahlian: '',
  })
  const [draft, setDraft] = useState(data)
  const [editing, setEditing] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const fileInputRef = useRef(null)

  const studentId = currentStudent?.id
  const studentName = currentStudent?.nama || currentUser?.nama || 'Siswa'
  const studentKelas = currentStudent?.kelas || currentUser?.kelas
  const studentNis = currentStudent?.nis || '-'
  const studentNomor = currentStudent?.nomor_siswa || currentStudent?.nis || '-'

  useEffect(() => {
    if (!studentId) return
    const next = portofolioService.getByStudentId(studentId)
    setData(next)
    setDraft(next)
    const unsub = portofolioService.subscribe(() => {
      const fresh = portofolioService.getByStudentId(studentId)
      setData(fresh)
      setDraft(fresh)
    })
    return () => unsub && unsub()
  }, [studentId])

  const handleFoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !studentId) return
    if (!file.type.startsWith('image/')) {
      showToast('Pilih file gambar (JPG/PNG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 5 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = portofolioService.updateFoto(studentId, reader.result)
      if (result.success) showToast('Foto berhasil diperbarui')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!studentId) return
    portofolioService.update(studentId, {
      foto: draft.foto,
      deskripsi: draft.deskripsi,
      hobi: draft.hobi,
      citaCita: draft.citaCita,
      keahlian: draft.keahlian,
    })
    setEditing(false)
    showToast('Portofolio berhasil disimpan')
  }

  const handleCancel = () => {
    setDraft(data)
    setEditing(false)
  }

  const showToast = (message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  if (!studentId) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Data siswa tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#00183d] flex items-center gap-3">
          <BookOpen className="h-7 w-7" />
          Portofolio Saya
        </h1>
        <p className="text-slate-500 mt-1">
          Kenali dirimu lebih dekat dan tunjukkan keahlianmu 🌟
        </p>
      </div>

      <div className="bg-gradient-to-r from-[#00183d] via-[#173E7A] to-[#3c5e9b] rounded-2xl p-6 lg:p-8 text-white mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <Avatar src={data.foto} name={studentName} size="xl" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-white text-[#00183d] flex items-center justify-center shadow-md border-2 border-white hover:scale-105 transition-transform"
              title="Ganti foto"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFoto}
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-medium mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Portofolio Siswa
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">{studentName}</h2>
            <p className="text-white/80 text-sm">
              Kelas {studentKelas || '-'} • No. Siswa {studentNomor}
            </p>
            <p className="text-white/60 text-xs mt-2">
              Foto diklik untuk diganti. Format JPG/PNG, maksimal 5 MB.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Identitas</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <User className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Nama Lengkap</p>
                <p className="text-sm font-semibold text-slate-800">{studentName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <School className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Kelas</p>
                <p className="text-sm font-semibold text-slate-800">{studentKelas || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <Hash className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Nomor Siswa (NIS)</p>
                <p className="text-sm font-semibold text-slate-800">{studentNis}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Heart className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Hobi</h3>
            </div>
            {editing ? (
              <input
                value={draft.hobi}
                onChange={(e) => setDraft({ ...draft, hobi: e.target.value })}
                placeholder="Contoh: Menggambar, membaca, bermain bola"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00183d]/20 focus:border-[#00183d]"
              />
            ) : (
              <p className="text-sm text-slate-700">{data.hobi || <span className="text-slate-400 italic">Belum diisi</span>}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Cita-Cita</h3>
            </div>
            {editing ? (
              <input
                value={draft.citaCita}
                onChange={(e) => setDraft({ ...draft, citaCita: e.target.value })}
                placeholder="Contoh: Programmer, dokter, guru"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00183d]/20 focus:border-[#00183d]"
              />
            ) : (
              <p className="text-sm text-slate-700">{data.citaCita || <span className="text-slate-400 italic">Belum diisi</span>}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Code className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Keahlian & Minat Coding</h3>
        </div>
        {editing ? (
          <textarea
            value={draft.keahlian}
            onChange={(e) => setDraft({ ...draft, keahlian: e.target.value })}
            rows={3}
            placeholder="Contoh: Scratch, HTML dasar, JavaScript"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00183d]/20 focus:border-[#00183d] resize-none"
          />
        ) : (
          <p className="text-sm text-slate-700 whitespace-pre-line">{data.keahlian || <span className="text-slate-400 italic">Belum diisi</span>}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Deskripsi Singkat Tentang Diri</h3>
        </div>
        {editing ? (
          <textarea
            value={draft.deskripsi}
            onChange={(e) => setDraft({ ...draft, deskripsi: e.target.value })}
            rows={4}
            placeholder="Ceritakan sedikit tentang dirimu..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00183d]/20 focus:border-[#00183d] resize-none"
          />
        ) : (
          <p className="text-sm text-slate-700 whitespace-pre-line">{data.deskripsi || <span className="text-slate-400 italic">Belum ada deskripsi. Klik "Edit Portofolio" untuk menambahkan.</span>}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {editing ? (
          <>
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00183d] text-white hover:bg-[#0F2D5C] flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Simpan Portofolio
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00183d] text-white hover:bg-[#0F2D5C] flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Edit Portofolio
          </button>
        )}
      </div>

      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm">
          {toast.message}
        </div>
      )}
    </div>
  )
}
