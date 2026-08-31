export const FORUM_TTL_MS = 24 * 60 * 60 * 1000;
export const FORUM_STORAGE_KEY = 'lms_public_forum_threads_v1';

export const FORUM_TAGS = [
  { id: 'all', label: 'Semua Topik', color: 'slate' },
  { id: 'qna', label: 'Tanya Jawab', color: 'amber' },
  { id: 'material', label: 'Diskusi Materi', color: 'blue' },
  { id: 'tech', label: 'Coding & Tech', color: 'emerald' },
  { id: 'tips', label: 'Tips Belajar', color: 'purple' },
  { id: 'general', label: 'Santai & Opini', color: 'rose' }
];

export function getTagInfo(tagId) {
  return FORUM_TAGS.find(t => t.id === tagId) || FORUM_TAGS[0];
}

export function formatRemainingTime(createdAt) {
  const elapsed = Date.now() - (Number(createdAt) || Date.now());
  const remaining = FORUM_TTL_MS - elapsed;
  if (remaining <= 0) return 'Kedaluwarsa';
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}j ${mins}m lagi`;
  return `${mins}m lagi`;
}

export function formatPostTime(createdAt) {
  const diff = Date.now() - (Number(createdAt) || Date.now());
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  return `${hours} jam lalu`;
}

export const INITIAL_FORUM_THREADS = [
  {
    threadId: 'th-newest',
    title: 'Bagaimana cara mengatasi error CORS saat deploy aplikasi ke Vercel / Netlify?',
    content: 'Permisi teman-teman, ada yang pernah mengalami error CORS ketika fetch endpoint backend Apps Script dari hosting frontend? Mohon sarannya ya!',
    tag: 'qna',
    codeSnippet: 'fetch("https://script.google.com/macros/s/.../exec", {\n  method: "POST",\n  headers: { "Content-Type": "text/plain;charset=utf-8" }\n})',
    authorId: 'USR-20260826-003',
    authorName: 'Dimas Wicaksono',
    authorRole: 'student',
    createdAt: Date.now() - 15 * 60 * 1000, // 15 mins ago (Terbaru #1)
    likes: [],
    replies: []
  },
  {
    threadId: 'th-closure',
    title: 'Bagaimana cara memahami konsep Closure dan Scope di JavaScript secara mendalam?',
    content: 'Halo teman-teman pembelajar! Saya sedang mempelajari materi JavaScript lanjutan. Ada tips atau analogi mudah untuk membedakan Lexical Scope dengan Closure saat membuat custom hook?',
    tag: 'tech',
    codeSnippet: 'function outer() {\n  const secret = 42;\n  return () => secret;\n}',
    authorId: 'USR-20260824-001',
    authorName: 'Ahmad Santoso',
    authorRole: 'student',
    createdAt: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    likes: ['USR-1', 'USR-2', 'USR-3', 'USR-4'],
    replies: [
      {
        replyId: 'rep-1',
        authorId: 'USR-ADMIN-1',
        authorName: 'Admin LMS',
        authorRole: 'admin',
        text: 'Analogi terbaik: Closure adalah seperti tas ransel yang dibawa fungsi anak yang berisi variabel dari rumah (scope) orang tuanya.',
        createdAt: Date.now() - 45 * 60 * 1000
      }
    ]
  },
  {
    threadId: 'th-streak',
    title: 'Sharing tips mempertahankan Streak Belajar harian agar tidak terputus 🔥',
    content: 'Siapa di sini yang sudah tembus streak di atas 14 hari? Biasanya kalian menyisihkan waktu jam berapa untuk menyelesaikan materi di LMS ini?',
    tag: 'tips',
    codeSnippet: '',
    authorId: 'USR-20260825-002',
    authorName: 'Rina Kusuma',
    authorRole: 'student',
    createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago (Terpopuler #1)
    likes: ['USR-1', 'USR-2', 'USR-3', 'USR-4', 'USR-5', 'USR-6', 'USR-7', 'USR-8', 'USR-9', 'USR-10'],
    replies: [
      {
        replyId: 'rep-2',
        authorId: 'USR-EDU-01',
        authorName: 'Budi Raharjo',
        authorRole: 'educator',
        text: 'Kuncinya adalah micro-learning 15-20 menit setiap pagi setelah bangun tidur sebelum memulai aktivitas lain.',
        createdAt: Date.now() - 5 * 60 * 60 * 1000
      },
      {
        replyId: 'rep-3',
        authorId: 'USR-20260824-001',
        authorName: 'Ahmad Santoso',
        authorRole: 'student',
        text: 'Setuju pak, saya biasa pasang alarm jam 6 pagi untuk langsung baca 1 materi.',
        createdAt: Date.now() - 4 * 60 * 60 * 1000
      }
    ]
  }
];
