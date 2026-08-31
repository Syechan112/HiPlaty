import { Users, Layers, FileText, Bell, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminStatsCards({
  totalUsers = 0,
  totalStudents = 0,
  totalEducators = 0,
  totalAdmins = 0,
  totalBatches = 0,
  totalModules = 0,
  totalContents = 0,
  allAnnouncements = []
}) {
  const cards = [
    {
      id: 'users',
      label: 'Total Pengguna',
      value: totalUsers,
      badge: `${totalStudents} Siswa`,
      icon: Users,
      link: '/admin/users'
    },
    {
      id: 'educators',
      label: 'Educator Aktif',
      value: totalEducators,
      badge: `${totalAdmins} Admin`,
      icon: GraduationCap,
      link: '/admin/users'
    },
    {
      id: 'batches',
      label: 'Batch Kurikulum',
      value: totalBatches,
      badge: 'Kurikulum',
      icon: Layers,
      link: '/educator/contents'
    },
    {
      id: 'materials',
      label: 'Materi Terbit',
      value: totalContents,
      badge: `${totalModules} Modul`,
      icon: FileText,
      link: '/educator/contents'
    },
    {
      id: 'announcements',
      label: 'Pengumuman',
      value: allAnnouncements?.length || 0,
      badge: 'Broadcast',
      icon: Bell,
      link: '/admin/announcements'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((item) => {
        const Icon = item.icon;
        const CardContent = (
          <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200/80 bg-white p-4.5 sm:p-5 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:border-slate-300 group">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 transition-colors group-hover:bg-slate-100">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>
              <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 font-mono">
                {item.badge}
              </span>
            </div>

            <div className="mt-3.5">
              <p className="font-mono text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors">
                {item.value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                {item.label}
              </p>
            </div>
          </div>
        );

        if (item.link) {
          return (
            <Link key={item.id} to={item.link} className="block">
              {CardContent}
            </Link>
          );
        }

        return <div key={item.id}>{CardContent}</div>;
      })}
    </div>
  );
}
