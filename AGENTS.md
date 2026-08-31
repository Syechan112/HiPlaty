Agent Directives & Coding Guidelines

## Core Principles
1. **No AI Slop in Design:** Avoid generic, overly purple/blue-tinted gradients, repetitive card grids, exaggerated animations, and generic template styling. Focus on custom, purposeful, clean, and distinct UI/UX that matches standard design systems.
2. **Clean Code (No Unnecessary Comments):** Do NOT add redundant comments, self-explanatory line descriptions, or docstrings inside code blocks unless explicitly requested or for extremely complex logic. The code itself must be self-documenting.

---

## UI / UX Design Rules (Anti-Slop)
- **Typography:** Avoid default system stack lookalikes unless specified. Use strong typographic hierarchy with distinctive spacing.
- **Color Palette:** Do not default to the generic AI "indigo/purple gradient on dark background" aesthetic. Use intentional, accessible color contrast.
- **Layout:** Avoid repetitive, cookie-cutter grid cards for every section. Use varied, structural, and content-first layout strategies.
- **Components:** Avoid unstyled standard boilerplate. Ensure buttons, inputs, and modals have precise micro-interactions without bloated code.

---

## Modular Architecture Rules (Anti-Monolith)
* **Single File Limit**: Setiap file React maksimal **150–250 baris kode**. Jangan pernah membuat atau membiarkan satu file berkembang hingga mendekati/melebihi 500+ baris.
* **Separation of Concerns**:
  * **UI Components (`/components`)**: Hanya bertanggung jawab untuk rendering markup & styling (Pure/Presentational).
  * **Business Logic & State (`/hooks`)**: Semua `useState`, `useEffect`, `useMemo`, `useCallback`, dan fungsi handler/submit WAJIB diekstrak ke dalam **Custom Hooks** terpisah (contoh: `useCourseForm.js`).
  * **Data & Options (`/constants` atau `/data`)**: Data statis (seperti opsi kategori, konfigurasi dropdown, dll.) harus dipisah keluar dari file komponen UI.

---

## Refactoring Protocol
Saat diperintahkan untuk merapikan (*refactor*) komponen raksasa:
1. **Ekstrak Custom Hook**: Pindahkan semua state, efek, dan handler logika ke file hook terpisah terlebih dahulu tanpa mengubah perilaku aplikasi.
2. **Pecah Sub-Components**: Identifikasi blok UI independen (misal: Card Panel, Modal, Form Field khusus) dan pisahkan ke file komponen terpisah di folder yang sesuai.
3. **Keep Props Clean**: Teruskan data ke sub-components menggunakan prop destructuring yang tertata rapi.
4. **Preserve Functionality**: Pastikan tidak ada fungsi, validasi, atau alur data yang hilang/rusak setelah proses refactoring.

---

## Code Quality & Comment Policy
- **NO Commented Code:** Do not leave commented-out code snippets.
- **NO Descriptive Commentary:** Do NOT write comments like:
  ```typescript
  // BAD:
  // Fetch user data from API
  const user = await fetchUser(); 
  
  // Return the result
  return user;