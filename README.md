# LMS - Learning Management System

Aplikasi LMS hybrid client-side dengan Google Sheets sebagai Headless CMS.

## Fitur

- **Dashboard**: Tampilan Bento grid dengan statistik dan progress tracking
- **Learning Page**: Sidebar accordion untuk navigasi Batch -> Modul -> Konten dengan rich text viewer
- **Settings Page**: Form profil, upload avatar (Base64), konfigurasi API, dan manajemen cache
- **Offline Support**: Automatic caching dengan LocalStorage
- **Progress Tracking**: Menyimpan progress belajar user

## Tech Stack

- React 19.2.8
- Vite 8.2.2
- Tailwind CSS
- Lucide React Icons
- React Router DOM

## API Endpoint

Google Apps Script:
```
https://script.google.com/macros/s/AKfycbw0MPW5ATFwq42onk1Rgl_HtyufVL2z1yvq-faqX1AOXbh-abf3zrtWKPQISv-rpIPf1A/exec
```

## LocalStorage Schema

- `lms_remote_cache`: Cache JSON dari Google Sheets
- `lms_user_profile`: Data profil user
- `lms_user_progress`: Array ID konten yang sudah selesai
- `lms_last_sync`: Timestamp sinkronisasi terakhir

## Custom Hooks

### `useLmsSync`
- Fetch dan sync data dari Google Sheets
- Auto-fallback ke cache saat offline
- Methods: `manualSync()`, `clearCache()`, `refetch()`

### `useLmsProgress`
- Manajemen progress belajar
- Methods: `markContentComplete()`, `isContentComplete()`, `calculateBatchProgress()`, `resetProgress()`

## Struktur Folder

```
src/
├── components/
│   ├── TopNav.jsx
│   ├── Sidebar.jsx
│   ├── CourseCard.jsx
│   ├── StatCard.jsx
│   ├── GuestBanner.jsx
├── hooks/
│   ├── useLmsSync.js
│   ├── useLmsProgress.js
├── pages/
│   ├── Dashboard.jsx
│   ├── LearningPage.jsx
│   └── SettingsPage.jsx
└── App.jsx
```

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Deployment

Deploy ke Vercel sebagai static site:
```bash
npm run build
vercel deploy --prod
```
