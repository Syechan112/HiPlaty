export function RoleBadge({ role }) {
  const roleStyles = {
    student: 'bg-slate-100 text-slate-700 border-slate-200',
    educator: 'bg-purple-50 text-purple-700 border-purple-200',
    admin: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  const roleLabels = {
    student: 'Student',
    educator: 'Educator',
    admin: 'Admin'
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${roleStyles[role] || roleStyles.student}`}>
      {roleLabels[role] || role}
    </span>
  );
}
