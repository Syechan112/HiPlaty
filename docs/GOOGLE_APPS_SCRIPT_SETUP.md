# ✅ Setup Google Apps Script - Langkah Detail

## Masalah "Loading Forever" - Solusi

### 1. Cek URL API di Settings
1. Buka `http://localhost:5173/settings`
2. Pastikan **API Configuration** berisi URL yang benar:
   ```
   https://script.google.com/macros/s/AKfycbx0ApLVcc7zT2_OtoVteaK1oDkMDt9HQSfX4Mw5qU2ljMmEXqbFBeRXuO9QOiUEQ-hM9Q/exec
   ```
3. Klik **Save & Sync**

### 2. Deploy Google Apps Script dengan Benar

#### Langkah Deploy:
1. **Buka Google Sheets** → **Extensions** → **Apps Script**
2. **Hapus semua kode** yang ada
3. **Paste script lengkap** di bawah ini
4. **Ganti `SPREADSHEET_ID`** dengan ID spreadsheet kamu

#### Script Google Apps Script (Copy Seluruhnya):
```javascript
const SPREADSHEET_ID = '1yOUR_SPREADSHEET_ID_HERE'; // GANTI DENGAN ID ANDA

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  const action = e.parameter.action;
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let result;
    
    switch (action) {
      case 'login':
        result = handleLogin(e, ss, method);
        break;
      case 'register':
        result = handleRegister(e, ss, method);
        break;
      case 'get_users':
        result = handleGetUsers(e, ss, method);
        break;
      case 'update_user_role':
        result = handleUpdateRole(e, ss, method);
        break;
      case 'get_courses':
      case null:
      case undefined:
        result = handleGetCourses(ss);
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
    
    output.setContent(JSON.stringify(result));
  } catch (err) {
    output.setContent(JSON.stringify({ error: err.message }));
  }
  
  return output;
}

function handleLogin(e, ss, method) {
  if (method !== 'POST') return { error: 'POST method required' };
  
  const data = JSON.parse(e.postData.contents);
  const { email, password } = data;
  
  if (!email || !password) return { error: 'Email and password required' };
  
  const sheet = ss.getSheetByName('Users');
  if (!sheet) return { error: 'Users sheet not found' };
  
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][2] === email && values[i][3] === password) {
      return {
        success: true,
        userId: values[i][0],
        name: values[i][1],
        email: values[i][2],
        role: values[i][4],
        createdAt: values[i][5]
      };
    }
  }
  
  return { error: 'Invalid email or password' };
}

function handleRegister(e, ss, method) {
  if (method !== 'POST') return { error: 'POST method required' };
  
  const data = JSON.parse(e.postData.contents);
  const { name, email, password, role } = data;
  
  if (!name || !email || !password) return { error: 'All fields required' };
  if (role === 'admin') return { error: 'Cannot register as admin' };
  if (role !== 'student' && role !== 'educator') return { error: 'Invalid role' };
  
  const sheet = ss.getSheetByName('Users');
  if (!sheet) return { error: 'Users sheet not found' };
  
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][2] === email) return { error: 'Email already registered' };
  }
  
  const userId = 'USR-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  const createdAt = new Date().toISOString();
  
  sheet.appendRow([userId, name, email, password, role, createdAt]);
  
  return { success: true, userId, name, email, role, createdAt };
}

function handleGetUsers(e, ss, method) {
  if (method !== 'POST') return { error: 'POST required' };
  
  const data = JSON.parse(e.postData.contents || '{}');
  if (data.role !== 'admin') return { error: 'Unauthorized' };
  
  const sheet = ss.getSheetByName('Users');
  const values = sheet.getDataRange().getValues();
  const users = [];
  
  for (let i = 1; i < values.length; i++) {
    users.push({
      userId: values[i][0],
      name: values[i][1],
      email: values[i][2],
      role: values[i][4],
      createdAt: values[i][5]
    });
  }
  
  return users;
}

function handleUpdateRole(e, ss, method) {
  if (method !== 'POST') return { error: 'POST required' };
  
  const data = JSON.parse(e.postData.contents);
  const { userId, newRole, requestingUser } = data;
  
  if (!requestingUser || requestingUser.role !== 'admin') return { error: 'Unauthorized' };
  if (!['student', 'educator', 'admin'].includes(newRole)) return { error: 'Invalid role' };
  
  const sheet = ss.getSheetByName('Users');
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === userId) {
      sheet.getRange(i + 1, 5).setValue(newRole);
      return { success: true, userId, newRole };
    }
  }
  
  return { error: 'User not found' };
}

function handleGetCourses(ss) {
  const sheet = ss.getSheetByName('Courses');
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  const courses = [];
  const batchMap = {};
  const moduleMap = {};
  
  for (let i = 1; i < values.length; i++) {
    const [batchId, batchName, moduleId, moduleTitle, contentId, title, htmlContent] = values[i];
    
    if (!batchMap[batchId]) {
      const batch = { batchId, batchName, modules: [] };
      batchMap[batchId] = batch;
      courses.push(batch);
    }
    
    const moduleKey = batchId + '-' + moduleId;
    if (!moduleMap[moduleKey]) {
      const module = { moduleId, moduleTitle, contents: [] };
      moduleMap[moduleKey] = module;
      batchMap[batchId].modules.push(module);
    }
    
    if (contentId && title) {
      moduleMap[moduleKey].contents.push({ contentId, title, htmlContent: htmlContent || '' });
    }
  }
  
  return courses;
}

function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  let usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) {
    usersSheet = ss.insertSheet('Users');
    usersSheet.appendRow(['userId', 'name', 'email', 'password', 'role', 'createdAt']);
    usersSheet.appendRow(['USR-ADMIN01', 'Admin', 'admin@lms.com', 'admin123', 'admin', new Date().toISOString()]);
  }
  
  let coursesSheet = ss.getSheetByName('Courses');
  if (!coursesSheet) {
    coursesSheet = ss.insertSheet('Courses');
    coursesSheet.appendRow(['batchId', 'batchName', 'moduleId', 'moduleTitle', 'contentId', 'title', 'htmlContent']);
  }
}
```

### 3. Deploy Web App

1. Klik **Deploy** → **New deployment**
2. Type: **Web app**
3. **Execute as**: Me (your email)
4. **Who has access**: **Anyone**
5. Klik **Deploy**
6. **Copy Web App URL** yang didapat

### 4. Jalankan Setup Sheets (Pertama Kali)

1. Di Apps Script editor, pilih function: **`setupSheets`**
2. Klik **Run**
3. Berikan permission saat diminta
4. Cek log di **View** → **Logs**

### 5. Test API Langsung

Buka browser dengan URL berikut:

**Test GET (get_courses):**
```
https://script.google.com/macros/s/AKfycbx0ApLVcc7zT2_OtoVteaK1oDkMDt9HQSfX4Mw5qU2ljMmEXqbFBeRXuO9QOiUEQ-hM9Q/exec
```

**Test Register (POST):**
```json
{
  "name": "Test User",
  "email": "test123@example.com",
  "password": "test123",
  "role": "student"
}
```

URL: `https://script.google.com/macros/s/AKfycbx0ApLVcc7zT2_OtoVteaK1oDkMDt9HQSfX4Mw5qU2ljMmEXqbFBeRXuO9QOiUEQ-hM9Q/exec?action=register`

### 6. Test Login di Aplikasi

1. Buka `http://localhost:5173/login`
2. Login dengan default admin:
   - Email: `admin@lms.com`
   - Password: `admin123`

### 7. Test Admin Panel

Setelah login sebagai admin:
1. Klik ikon **Shield** (🛡️) di sidebar
2. Harus muncul daftar users dalam 2-3 detik

## Troubleshooting

### Error: "Users sheet not found"
✅ Jalankan function `setupSheets()` di Apps Script editor

### Error: "Unauthorized"
✅ Pastikan login sebagai admin dulu sebelum akses Admin Panel

### Loading terus tanpa selesai
✅ Cek:
1. URL di Settings sudah benar?
2. Google Apps Script sudah di-deploy dengan akses "Anyone"?
3. Spreadsheet ID di script sudah benar?

### "Failed to fetch"
✅ Cek koneksi internet dan pastikan Google Apps Script sudah deployed

---

## Default Credentials (Setelah Setup)
- Admin: `admin@lms.com` / `admin123`
- Data disimpan di Google Sheets tab "Users"
