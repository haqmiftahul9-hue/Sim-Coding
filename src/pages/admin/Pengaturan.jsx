import { useState } from 'react'
import {
  Clock,
  MapPin,
  QrCode,
  ScanFace,
  School,
  Users,
  Settings,
  Plus,
  Trash2,
  Save,
  X,
  Edit3,
} from 'lucide-react'
import SettingCard from '../../components/settings/SettingCard'
import Toggle from '../../components/settings/Toggle'
import MapPreview from '../../components/settings/MapPreview'
import AdminModal from '../../components/settings/AdminModal'
import {
  attendanceSettings as initialAttendance,
  geofencingSettings as initialGeofencing,
  methodSettings as initialMethods,
  schoolProfile as initialSchool,
  systemConfig as initialSystem,
  adminList as initialAdmins,
  semesterOptions,
  academicYearOptions,
} from '../../Data/settingsData'

const tabs = [
  { id: 'presensi', label: 'Pengaturan Presensi', icon: Clock },
  { id: 'identitas', label: 'Identitas Sekolah', icon: School },
  { id: 'admin', label: 'Manajemen Admin', icon: Users },
  { id: 'sistem', label: 'Pengaturan Sistem', icon: Settings },
]

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState('presensi')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)

  // Attendance settings state
  const [attendance, setAttendance] = useState(initialAttendance)
  const [geofencing, setGeofencing] = useState(initialGeofencing)
  const [methods, setMethods] = useState(initialMethods)
  const [school, setSchool] = useState(initialSchool)
  const [system, setSystem] = useState(initialSystem)
  const [admins, setAdmins] = useState(initialAdmins)

  const showToast = (message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const handleSave = () => {
    // TODO: Save to Supabase
    showToast('Pengaturan berhasil disimpan.')
  }

  const handleCancel = () => {
    setAttendance(initialAttendance)
    setGeofencing(initialGeofencing)
    setMethods(initialMethods)
    setSchool(initialSchool)
    setSystem(initialSystem)
    setAdmins(initialAdmins)
    showToast('Perubahan dibatalkan.')
  }

  const handleAddAdmin = (admin) => {
    if (admin.id) {
      // Edit existing admin - update data in list
      setAdmins((prevAdmins) =>
        prevAdmins.map((a) =>
          a.id === admin.id
            ? { ...admin }
            : a
        )
      )
      showToast('Data admin berhasil diperbarui.')
    } else {
      // Add new admin
      const newAdmin = {
        ...admin,
        id: admins.length > 0 ? Math.max(...admins.map((a) => a.id)) + 1 : 1,
      }
      setAdmins([...admins, newAdmin])
      showToast('Admin berhasil ditambahkan.')
    }
  }

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin)
    setShowAdminModal(true)
  }

  const handleDeleteAdmin = (id) => {
    setAdmins(admins.filter((a) => a.id !== id))
    showToast('Admin berhasil dihapus.')
  }

  const handleCloseAdminModal = () => {
    setShowAdminModal(false)
    setEditingAdmin(null)
  }

  return (
    <div className="mx-auto max-w-container-max space-y-6 pb-24">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
          Pengaturan Sistem
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Kelola konfigurasi presensi, identitas sekolah, dan pengaturan admin.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-lg">
        {/* Settings Sub-Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-surface-container-lowest rounded-xl card-shadow border border-[#F1F5F9] p-sm flex flex-col gap-xs lg:sticky lg:top-24">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left border-l-2 ${
                    isActive
                      ? 'bg-white/10 text-primary font-semibold border-brand'
                      : 'text-on-surface-variant hover:bg-surface-container-low font-medium border-transparent'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-brand' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 space-y-lg">
          {/* Tab 1: Pengaturan Presensi */}
          {activeTab === 'presensi' && (
            <>
              {/* Konfigurasi Waktu */}
              <SettingCard
                title="Konfigurasi Waktu Presensi"
                description="Tentukan jam operasional kehadiran siswa."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Jam Masuk Mulai</label>
                    <input
                      type="time"
                      value={attendance.attendance_start}
                      onChange={(e) => setAttendance({ ...attendance, attendance_start: e.target.value })}
                      className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Batas Tepat Waktu</label>
                    <input
                      type="time"
                      value={attendance.attendance_on_time}
                      onChange={(e) => setAttendance({ ...attendance, attendance_on_time: e.target.value })}
                      className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Batas Terlambat</label>
                    <input
                      type="time"
                      value={attendance.attendance_late}
                      onChange={(e) => setAttendance({ ...attendance, attendance_late: e.target.value })}
                      className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Jam Pulang</label>
                    <input
                      type="time"
                      value={attendance.attendance_end}
                      onChange={(e) => setAttendance({ ...attendance, attendance_end: e.target.value })}
                      className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                    />
                  </div>
                </div>
              </SettingCard>

              {/* Geofencing */}
              <SettingCard
                title="Validasi Lokasi (Geofencing)"
                description="Atur titik koordinat sekolah untuk validasi presensi berbasis lokasi."
              >
                <div className="flex flex-col xl:flex-row gap-lg">
                  <div className="flex-1 space-y-md">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface">Latitude</label>
                      <input
                        type="text"
                        value={geofencing.school_latitude}
                        onChange={(e) => setGeofencing({ ...geofencing, school_latitude: e.target.value })}
                        className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface">Longitude</label>
                      <input
                        type="text"
                        value={geofencing.school_longitude}
                        onChange={(e) => setGeofencing({ ...geofencing, school_longitude: e.target.value })}
                        className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface">Radius Toleransi (Meter)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="50"
                          max="1000"
                          value={geofencing.attendance_radius}
                          onChange={(e) => setGeofencing({ ...geofencing, attendance_radius: parseInt(e.target.value) })}
                          className="w-full accent-secondary"
                        />
                        <span className="font-body-md text-body-md text-on-surface font-medium w-16 text-right">
                          {geofencing.attendance_radius}m
                        </span>
                      </div>
                    </div>
                  </div>
                  <MapPreview
                    latitude={geofencing.school_latitude}
                    longitude={geofencing.school_longitude}
                    radius={geofencing.attendance_radius}
                  />
                </div>
              </SettingCard>

              {/* Metode Presensi */}
              <SettingCard
                title="Metode Presensi Aktif"
                description="Aktifkan atau nonaktifkan fitur yang dapat digunakan siswa."
              >
                <div className="space-y-4">
                  <Toggle
                    label="Barcode Scanner"
                    description="Gunakan ID Card siswa untuk tap-in pada mesin."
                    icon={<QrCode className="h-5 w-5" />}
                    checked={methods.barcode_enabled}
                    onChange={(checked) => setMethods({ ...methods, barcode_enabled: checked })}
                  />
                  <Toggle
                    label="Face Recognition"
                    description="Validasi biometrik melalui perangkat mobile siswa."
                    icon={<ScanFace className="h-5 w-5" />}
                    checked={methods.face_enabled}
                    onChange={(checked) => setMethods({ ...methods, face_enabled: checked })}
                  />
                  <Toggle
                    label="Location Validation"
                    description="Haruskan siswa berada di area radius sekolah."
                    icon={<MapPin className="h-5 w-5" />}
                    checked={methods.location_enabled}
                    onChange={(checked) => setMethods({ ...methods, location_enabled: checked })}
                  />
                </div>
              </SettingCard>
            </>
          )}

          {/* Tab 2: Identitas Sekolah */}
          {activeTab === 'identitas' && (
            <SettingCard
              title="Identitas & Pejabat"
              description="Data ini akan digunakan untuk PDF Rapor dan dokumen resmi."
            >
              <div className="space-y-md">
                {/* Logo Upload */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface">Logo Sekolah</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center bg-surface-container-low overflow-hidden">
                      {school.logo ? (
                        <img src={school.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <School className="h-8 w-8 text-outline" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => setSchool({ ...school, logo: reader.result })
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-primary cursor-pointer hover:bg-surface-container-low transition-colors font-label-md text-label-md"
                      >
                        <Plus className="h-4 w-4" />
                        Upload Logo
                      </label>
                      <p className="font-body-sm text-body-sm text-outline mt-1">PNG, JPG max 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Nama Sekolah</label>
                    <input
                      type="text"
                      value={school.name}
                      onChange={(e) => setSchool({ ...school, name: e.target.value })}
                      className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Nama Kepala Sekolah</label>
                    <input
                      type="text"
                      value={school.principal_name}
                      onChange={(e) => setSchool({ ...school, principal_name: e.target.value })}
                      className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface">Alamat</label>
                  <textarea
                    value={school.address}
                    onChange={(e) => setSchool({ ...school, address: e.target.value })}
                    rows={3}
                    className="w-full bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 py-2.5 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface">Nama Guru Coding</label>
                  <input
                    type="text"
                    value={school.teacher_name}
                    onChange={(e) => setSchool({ ...school, teacher_name: e.target.value })}
                    className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                  />
                </div>
              </div>
            </SettingCard>
          )}

          {/* Tab 3: Manajemen Admin */}
          {activeTab === 'admin' && (
            <SettingCard
              title="Manajemen Admin"
              description="Kelola akun admin dan guru coding yang memiliki akses ke sistem."
            >
              <div className="space-y-4">
                {/* Add Admin Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#173E7A] text-white font-label-md text-label-md hover:bg-primary transition-colors shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Admin
                  </button>
                </div>

                {/* Admin List */}
                <div className="space-y-3">
                  {admins.length === 0 ? (
                    <div className="py-12 text-center">
                      <Users className="h-12 w-12 text-outline mx-auto mb-3" />
                      <p className="font-body-md text-body-md text-outline">Belum ada admin terdaftar.</p>
                    </div>
                  ) : (
                    admins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-surface-border bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                            {admin.nama
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-label-md text-label-md text-on-surface">{admin.nama}</h3>
                            <p className="font-body-sm text-body-sm text-outline">{admin.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              admin.role === 'Admin'
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {admin.role}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEditAdmin(admin)}
                            className="p-2 rounded-lg text-outline hover:text-secondary hover:bg-surface-container-low transition-colors"
                            aria-label="Edit admin"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container/50 transition-colors"
                            aria-label="Hapus admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SettingCard>
          )}

          {/* Tab 4: Pengaturan Sistem */}
          {activeTab === 'sistem' && (
            <SettingCard
              title="Pengaturan Sistem"
              description="Konfigurasi umum sistem SimCoding."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface">Semester Aktif</label>
                  <select
                    value={system.semester}
                    onChange={(e) => setSystem({ ...system, semester: e.target.value })}
                    className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none appearance-none cursor-pointer"
                  >
                    {semesterOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface">Tahun Akademik</label>
                  <select
                    value={system.academic_year}
                    onChange={(e) => setSystem({ ...system, academic_year: e.target.value })}
                    className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none appearance-none cursor-pointer"
                  >
                    {academicYearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface">Nama Program Coding</label>
                  <input
                    type="text"
                    value={system.program_name}
                    onChange={(e) => setSystem({ ...system, program_name: e.target.value })}
                    className="w-full h-11 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
                  />
                </div>
              </div>
            </SettingCard>
          )}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[260px] bg-surface/95 backdrop-blur-sm border-t border-surface-border z-30">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end gap-sm">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg bg-surface-container-lowest border border-[#E2E8F0] text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-[#173E7A] text-white font-label-md text-label-md hover:bg-primary shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Admin Modal */}
      {showAdminModal && (
        <AdminModal
          onClose={handleCloseAdminModal}
          onSave={handleAddAdmin}
          admin={editingAdmin}
        />
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg">
            <Save className="h-5 w-5 shrink-0" />
            <span className="font-label-md text-label-md">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast({ visible: false, message: '' })}
              className="ml-2 p-1 hover:bg-emerald-700 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
