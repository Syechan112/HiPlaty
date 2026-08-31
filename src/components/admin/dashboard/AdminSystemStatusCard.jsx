import { Server, CheckCircle2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../../config/api';

export function AdminSystemStatusCard() {
  const currentEndpoint = localStorage.getItem('lms_api_url') || API_URL;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Status Endpoint & Server</h2>
              <p className="text-[11px] text-slate-400">Konektivitas Google Apps Script / DB</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Terhubung</span>
          </div>
        </div>

        <div className="pt-4 space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Endpoint URL</span>
            <p className="font-mono text-[11px] text-slate-700 break-all">{currentEndpoint}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Metode Cache</span>
              <span className="font-bold text-slate-900 mt-0.5 block">LocalStorage + Sync</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Protokol Sync</span>
              <span className="font-bold text-slate-900 mt-0.5 block">REST JSON / POST</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Environment: Production</span>
        <Link
          to="/settings"
          className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Pengaturan Server</span>
        </Link>
      </div>
    </div>
  );
}
