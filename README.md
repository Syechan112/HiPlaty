# HiPlaty - Next-Gen Hybrid Learning Management System

<p align="center">
  <img src="public/favicon.svg" alt="HiPlaty Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>Platform Pembelajaran Interaktif Modern berbasis React 19, Tailwind CSS v4, dan Headless CMS Google Sheets</strong>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8.2.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel Ready" /></a>
  <a href="https://github.com/Syechan112/HiPlaty"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" /></a>
</p>

---

## 📖 Tentang HiPlaty

**HiPlaty** adalah platform *Learning Management System* (LMS) modern dengan arsitektur hibrida (*hybrid client-side*) yang mengombinasikan kecepatan aplikasi SPA (Single Page Application) dengan fleksibilitas Google Sheets sebagai database & Headless CMS. HiPlaty dirancang untuk memberikan pengalaman belajar yang imersif, terstruktur, dan kolaboratif bagi **Siswa (Student)**, **Pendidik (Educator)**, dan **Administrator (Admin)**.

---

## ✨ Fitur Utama Berdasarkan Peran

### 🎓 1. Ekosistem Siswa (Student & Learning Space)
* **Interactive Dashboard**: Bento-grid interaktif dengan *stat cards*, visualisasi durasi belajar harian/mingguan/bulanan, dan kalender streak belajar harian.
* **Explore Materials**: Eksplorasi katalog materi kurikulum dengan filter kategori, tingkat kesulitan, pencarian instan, dan bookmark materi favorit.
* **Study Room**: Ruang baca materi terstruktur (Batch → Modul → Pelajaran) dengan pelacak durasi baca (*Learning Tracker*), panel catatan pribadi (*Notes Panel*), dan kolom diskusi materi.
* **Study Group & Collaboration**: Buat dan gabung grup belajar menggunakan kode unik (*Invite Code*), diskusikan materi, dan bagikan materi pelajaran bersama teman.
* **Social & Community**:
  * **Real-time Chat**: Percakapan 1-on-1 antar pengguna dengan notifikasi badge.
  * **Forum Diskusi**: Komunitas tanya jawab publik dengan sistem *voting* dan *thread tags*.
* **Daily Streak & Leaderboard**: Klaim streak harian untuk memupuk konsistensi belajar dan pantau peringkat di papan peringkat komunitas.

---

### 👨‍🏫 2. Studio Pendidik (Educator Studio)
* **Educator Dashboard**: Ringkasan performa materi yang diterbitkan, total siswa yang menyimpan materi, dan aktivitas pembelajaran terkini.
* **Content Manager**: Manajemen kurikulum terpadu (Batch, Modul, Materi) dengan filter status (Draft/Published) dan kategori.
* **WYSIWYG Rich Text Editor**: Editor materi canggih dengan dukungan heading hierarki, inline code blocks, callouts catatan penting, bullet & numbered lists, serta pratinjau instan.
* **Advanced Learning Analytics**:
  * Grafik distribusi kurikulum berdasarkan topik (*Bar & Donut Views*).
  * Tabel metrik performa pelajaran (Total Views, Durasi Rata-rata, Saved Count).
  * Pemeringkatan materi terpopuler.

---

### 🛡️ 3. Pusat Kendali Administrator (Admin Control Center)
* **Admin Dashboard**: Monitoring kesehatan sistem, status sinkronisasi backend, dan ringkasan metrik global platform.
* **User Management**: Manajemen akun pengguna, pencarian siswa/pendidik, dan pembaruan hak akses peran (*Role Assignment*).
* **Global Announcements**: Buat, edit, dan siarkan pengumuman resmi platform kepada seluruh siswa dan pendidik dengan filter target audiens.

---

## 🛠️ Tech Stack & Arsitektur

| Layer | Teknologi & Pustaka |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [React DOM 19](https://react.dev/) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) (Code-splitting via `lazy` & `Suspense`) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) + Modern Glassmorphism & Custom Palettes |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Security & Auth** | Web Crypto API (SHA-256 Client-side Hashing) + Role-Based Route Guards |
| **Backend & Headless CMS** | [Google Apps Script (GAS)](https://developers.google.com/apps-script) + Google Sheets Database |
| **Offline Engine** | LocalStorage Smart Cache & Sync Manager (`useLmsSync`) |

---

## 📂 Struktur Direktori Proyek

```text
lms-v1/
├── docs/                        # Dokumentasi teknis & skrip Google Apps Script
│   ├── AUTHENTICATION_SETUP.md
│   ├── EDUCATOR_FEATURE.md
│   ├── EDUCATOR_IMPLEMENTATION.md
│   ├── GOOGLE_APPS_SCRIPT_SETUP.md
│   └── googleAppsScript.js
├── public/                      # Aset statis publik & favicon
├── src/
│   ├── assets/                  # Logo, ilustrasi webp, dan vektor
│   ├── components/              # Komponen antarmuka presentasional murni
│   │   ├── admin/               # Komponen Dashboard, User, & Pengumuman Admin
│   │   ├── announcements/       # Komponen Item & Modal Pengumuman
│   │   ├── common/              # Komponen Umum (PageLoader, ConfirmModal, Select)
│   │   ├── dashboard/           # Komponen Widget & Chart Dashboard Siswa
│   │   ├── educator/            # Komponen Editor, Manager, & Analytics Educator
│   │   ├── forum/               # Komponen Thread, Card, & Filter Forum
│   │   ├── learning/            # Komponen Explore, Study Room, & Notes
│   │   ├── settings/            # Komponen Pengaturan Profil & Cache
│   │   ├── social/              # Komponen Chat & Study Group
│   │   ├── CourseCard.jsx
│   │   ├── RichTextEditor.jsx
│   │   ├── Sidebar.jsx
│   │   └── TopNav.jsx
│   ├── config/                  # Konfigurasi endpoint API & kategori konten
│   │   ├── api.js
│   │   └── contentCategories.js
│   ├── constants/               # Konstanta palet chart & konfigurasi forum
│   ├── hooks/                   # Custom Hooks (Semua Business Logic & State)
│   │   ├── useAdminDashboard.js
│   │   ├── useAnnouncements.js
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   ├── useContentEditor.js
│   │   ├── useEducatorAnalytics.js
│   │   ├── useEducatorContentManager.js
│   │   ├── useForum.js
│   │   ├── useLearningTracker.js
│   │   ├── useLmsSync.js
│   │   ├── useStudyGroup.js
│   │   └── ...
│   ├── pages/                   # Komponen halaman level rute
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── educator/
│   │   ├── learning/
│   │   ├── social/
│   │   ├── Dashboard.jsx
│   │   └── SettingsPage.jsx
│   ├── utils/                   # Helper murni (slug, chatHelpers, studyGroupHelpers)
│   ├── App.jsx                  # Route orchestrator & role guards
│   ├── index.css                # Konfigurasi Tailwind v4 & typography
│   └── main.jsx                 # Entry point React
├── .gitignore
├── AGENTS.md                    # Direktif kode bersih & panduan arsitektur
├── eslint.config.js             # Konfigurasi ESLint 10 flat config
├── hasil-test.md                # Laporan audit & hasil pengujian build/linter
├── package.json
├── vercel.json                  # Konfigurasi SPA URL rewrite untuk Vercel
└── vite.config.js
```

---

## 🚀 Memulai (Quick Start)

### 1. Kloning & Instalasi Dependensi
```bash
git clone https://github.com/Syechan112/HiPlaty.git
cd HiPlaty
npm install
```

### 2. Konfigurasi Environment (Opsional)
Buat file `.env` di root direktori jika ingin mengarahkan ke endpoint Google Apps Script khusus:
```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_APPS_SCRIPT_DEPLOYMENT_ID/exec
```

### 3. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 4. Menjalankan Pemeriksaan Kode & Build Produksi
```bash
# Validasi linter (ESLint)
npm run lint

# Kompilasi bundel produksi
npm run build

# Preview hasil build lokal
npm run preview
```

---

## 🌐 Panduan Deployment ke Vercel

Proyek ini telah dilengkapi dengan file konfigurasi [vercel.json](file:///d:/project-example/lms-v1/vercel.json) untuk mendukung routing SPA secara otomatis tanpa error 404 saat me-refresh halaman.

### Langkah Deploy Cepat:
1. Hubungkan repository GitHub [HiPlaty](https://github.com/Syechan112/HiPlaty) ke [Vercel Dashboard](https://vercel.com/new).
2. Konfigurasi build otomatis:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
3. Klik **Deploy**. Aplikasi akan online dan siap digunakan dalam hitungan detik!

---

## 🔒 Skema Keamanan & Penyimpanan

* **Hashing Password**: Password di-hash menggunakan SHA-256 sebelum dikirimkan ke endpoint backend.
* **Role Guard Protection**: Rute `/admin/*` dan `/educator/*` diproteksi ketat menggunakan `ProtectedRoute` dan `ProtectedEducatorRoute`.
* **State Isolation**: Data lokal siswa, progres materi, catatan, dan cache tersimpan secara terisolasi berdasarkan `userId` di `localStorage`.

---

## 📄 Lisensi

Dikembangkan oleh **Syechan** & kontributor komunitas. Bebas digunakan untuk tujuan pembelajaran dan pengembangan open-source.
