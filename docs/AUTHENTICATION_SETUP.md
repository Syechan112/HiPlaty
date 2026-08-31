# LMS Authentication & RBAC System - Setup Guide

## Overview
Sistem LMS dengan autentikasi dan Role-Based Access Control (RBAC) menggunakan Google Sheets sebagai database dan Google Apps Script sebagai backend API.

## Roles & Permissions

### 1. Student (Public Registration)
- Membaca materi pembelajaran
- Menandai materi sebagai selesai
- Melihat progress belajar pribadi
- Akses halaman: Dashboard, Learning, Settings

### 2. Educator (Public Registration)
- Semua permissions Student
- Melihat statistik progress kelas
- Mengelola/menambah modul materi pembelajaran
- Akses halaman: Dashboard, Learning, Settings

### 3. Admin (Private - Manual Setup)
- **TIDAK BISA** didaftarkan dari form publik
- Full control: User Management, Content Management, System Settings
- Mengubah role user lain (promote/demote)
- Akses semua halaman termasuk Admin Panel

---

## Google Sheets Setup

### 1. Buat Google Spreadsheet Baru
1. Buka https://sheets.google.com
2. Buat spreadsheet baru dengan nama "LMS Database"
3. Catat **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 2. Buat Sheet "Users"
Buat sheet dengan nama **Users** dan kolom berikut:

| userId | name | email | password | role | createdAt |
|--------|------|-------|----------|------|-----------|

**Contoh data admin (tambahkan manual):**
```
USR-ADMIN001 | Admin User | admin@lms.com | admin123 | admin | 2026-08-26T12:00:00Z
```

### 3. Buat Sheet "Courses" (Optional)
Untuk data kursus:

| batchId | batchName | moduleId | moduleTitle | contentId | title | htmlContent |
|---------|-----------|----------|-------------|-----------|-------|-------------|

---

## Google Apps Script Deployment

### 1. Buka Script Editor
1. Di Google Sheets, klik **Extensions** → **Apps Script**
2. Hapus semua kode default

### 2. Copy Script
Copy kode Google Apps Script lengkap dari file `googleAppsScript.js` di folder `docs/`:

```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Ganti dengan ID spreadsheet Anda

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

// ... (copy semua kode dari docs/googleAppsScript.js)
```

**PENTING:** Ganti `YOUR_SPREADSHEET_ID_HERE` dengan Spreadsheet ID Anda!

### 3. Deploy sebagai Web App
1. Klik **Deploy** → **New deployment**
2. Pilih type: **Web app**
3. Settings:
   - **Description**: LMS API v1
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Klik **Deploy**
5. Copy **Web app URL** yang diberikan:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

### 4. Jalankan Setup (First Time Only)
1. Di Apps Script editor, pilih function: `setupSheets`
2. Klik **Run**
3. Berikan permission saat diminta
4. Check log untuk memastikan setup berhasil

---

## Konfigurasi Frontend React

### 4. Konfigurasi Frontend React

Semua konfigurasi API sudah di-centralize di file `src/config/api.js`:

```javascript
// src/config/api.js
export const API_URL = 'https://script.google.com/macros/s/AKfycbx0ApLVcc7zT2_OtoVteaK1oDkMDt9HQSfX4Mw5qU2ljMmEXqbFBeRXuO9QOiUEQ-hM9Q/exec';
export const CACHE_KEY = 'lms_remote_cache';
export const SYNC_TIME_KEY = 'lms_last_sync';
export const AUTH_KEY = 'lms_user_auth';
export const USER_PROFILE_KEY = 'lms_user_profile';
export const PROGRESS_KEY = 'lms_user_progress';
```

### 5. Update API URL di Settings (Runtime)
1. Jalankan aplikasi: `npm run dev`
2. Buka browser: http://localhost:5173
3. Navigasi ke **Settings**
4. Di bagian **API Configuration**, paste Web App URL dari Google Apps Script
5. Klik **Save & Sync**

URL akan disimpan di LocalStorage (`lms_api_url`) dan otomatis digunakan untuk semua request selanjutnya.

---

## Testing Authentication

### 1. Test Login Admin
1. Buka http://localhost:5173/login
2. Login dengan kredensial default:
   - Email: `admin@lms.com`
   - Password: `admin123`
3. Setelah login, akses **Admin Panel** (ikon Shield di sidebar)

### 2. Test Public Registration
1. Buka http://localhost:5173/register
2. Isi form:
   - Name: Test Student
   - Email: student@test.com
   - Password: test123
   - Role: **Student** atau **Educator** (Admin tidak muncul)
3. Submit → otomatis login

### 3. Test Role Management (Admin Only)
1. Login sebagai Admin
2. Klik ikon **Shield** di sidebar (Admin Panel)
3. Lihat daftar semua user
4. Ubah role user dengan dropdown di kolom Actions
5. User dapat di-promote menjadi Admin

---

## Security Notes

### ⚠️ CRITICAL: Role Admin Protection
- Form registrasi publik **HANYA** menampilkan role Student dan Educator
- Google Apps Script memblokir request registrasi dengan `role: "admin"`
- Admin hanya bisa dibuat:
  1. Manual via Google Sheets
  2. Promoted oleh Admin lain via Admin Panel

### Password Storage
- **PERHATIAN**: Saat ini password disimpan plain text di Google Sheets
- Untuk production, implementasikan:
  - Password hashing (bcrypt/argon2)
  - JWT tokens untuk session management
  - Rate limiting untuk login attempts

---

## API Endpoints (Google Apps Script)

### 1. Login
```
POST ?action=login
Body: { email, password }
Response: { userId, name, email, role, createdAt }
```

### 2. Register
```
POST ?action=register
Body: { name, email, password, role }
Response: { userId, name, email, role, createdAt }
Note: Rejects role="admin" from public form
```

### 3. Get Users (Admin Only)
```
POST ?action=get_users
Body: { role: "admin" }
Response: [{ userId, name, email, role, createdAt }, ...]
```

### 4. Update User Role (Admin Only)
```
POST ?action=update_user_role
Body: { userId, newRole, requestingUser: { role: "admin" } }
Response: { success: true, userId, newRole }
```

---

## Troubleshooting

### Error: "Cannot register as admin"
✅ **Normal behavior** - Admin tidak bisa dibuat dari form publik.
Solusi: Tambahkan admin manual di Google Sheets atau promote via Admin Panel.

### Error: "Unauthorized. Admin access required"
❌ User bukan admin tapi coba akses Admin Panel.
Solusi: Login sebagai admin atau minta admin promote role Anda.

### Error: "Failed to fetch users"
Kemungkinan:
1. API URL salah → Check Settings
2. Google Apps Script belum di-deploy → Deploy ulang
3. Spreadsheet ID salah → Update di Apps Script

### Error: "Users sheet not found"
Solusi: Jalankan function `setupSheets()` di Apps Script editor.

---

## Production Deployment

### 1. Update Security
- Implement password hashing
- Add JWT authentication
- Enable CORS properly
- Add rate limiting

### 2. Deploy Frontend ke Vercel
```bash
npm run build
vercel deploy --prod
```

### 3. Environment Variables
Simpan API URL di environment variables:
```env
VITE_API_URL=https://script.google.com/.../exec
```

---

## File Structure
```
src/
├── hooks/
│   ├── useAuth.js           # Authentication & RBAC logic
│   ├── useLmsSync.js        # Data sync dengan Google Sheets
│   └── useLmsProgress.js    # Progress tracking
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx    # Login form
│   │   └── RegisterPage.jsx # Register form (Student/Educator only)
│   ├── admin/
│   │   └── AdminUserManagement.jsx # Admin panel
│   ├── Dashboard.jsx
│   ├── LearningPage.jsx
│   └── SettingsPage.jsx
├── components/
│   ├── RoleBadge.jsx        # Role badge UI
│   ├── TopNav.jsx           # Navigation dengan logout
│   └── Sidebar.jsx          # Sidebar dengan admin menu
└── App.jsx                  # Protected routes

docs/
└── googleAppsScript.js      # Backend API script
```

---

## LocalStorage Keys
- `lms_user_auth`: User authentication data
- `lms_user_profile`: User profile settings
- `lms_remote_cache`: Cached course data
- `lms_user_progress`: Learning progress
- `lms_last_sync`: Last sync timestamp
- `lms_api_url`: Google Apps Script URL

---

## Support
Untuk pertanyaan atau issue, buka https://github.com/anomalyco/opencode/issues
