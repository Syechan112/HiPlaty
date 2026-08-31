import { useState } from 'react';
import { Users, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudyGroup } from '../../../hooks/useStudyGroup';
import { getLocalConv, setLocalConv } from '../../../utils/chatHelpers';

export function ChatStudyGroupInviteCard({
  message,
  currentUserId
}) {
  const { groups, joinGroupById, setActiveGroupId } = useStudyGroup();
  const [copiedId, setCopiedId] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);

  // Extract invite details
  const invite = message.inviteData || (() => {
    const text = message.messageText || '';
    const groupMatch = text.match(/ID Room:\s*(SG-[A-Z0-9-]+)/i);
    const titleMatch = text.match(/Kelompok Belajar "([^"]+)"/i) || text.match(/Study Group "([^"]+)"/i);
    return {
      groupId: groupMatch ? groupMatch[1] : '',
      groupName: titleMatch ? titleMatch[1] : 'Study Group Kolaboratif',
      inviterName: message.senderName || 'Teman Belajar',
      inviterId: message.senderId
    };
  })();

  const cleanDisplayName = (rawName, fallbackId) => {
    if (!rawName) return fallbackId || 'Teman Belajar';
    if (rawName.startsWith('Teman (')) {
      const inside = rawName.replace(/^Teman \((.+)\)$/, '$1');
      const clean = inside.replace(/^(USR-|user_)/i, '').replace(/_/g, ' ');
      if (clean.length > 2 && isNaN(clean)) {
        return clean.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      return inside;
    }
    return rawName;
  };

  const isSender = String(message.senderId).toLowerCase() === String(currentUserId).toLowerCase();
  const receiverDisplayName = isSender
    ? cleanDisplayName(message.receiverName, message.receiverId)
    : 'Anda';
  const inviterDisplayName = isSender
    ? 'Anda'
    : cleanDisplayName(invite.inviterName || message.senderName, message.senderId);

  const otherUserId = String(
    isSender ? (message.receiverId || '') : (message.senderId || '')
  ).trim();

  // Persist status change to both users' conversation in storage
  const updateMessageStatus = (status) => {
    setLocalStatus(status);
    if (!message?.messageId || !otherUserId || !currentUserId) return;
    try {
      const conv = getLocalConv(currentUserId, otherUserId);
      const updated = conv.map((m) => {
        if (m.messageId === message.messageId) {
          return {
            ...m,
            inviteStatus: status,
            inviteData: {
              ...(m.inviteData || invite),
              status
            }
          };
        }
        return m;
      });
      setLocalConv(currentUserId, otherUserId, updated);
    } catch (e) {
      console.warn(e);
    }
  };

  const currentStatus = localStatus || message.inviteStatus || message.inviteData?.status || null;

  const handleCopyGroupId = () => {
    if (invite.groupId && navigator.clipboard) {
      navigator.clipboard.writeText(invite.groupId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleAcceptInvite = () => {
    if (!invite.groupId) return;
    setIsJoining(true);
    joinGroupById(invite.groupId);
    if (setActiveGroupId) {
      setActiveGroupId(invite.groupId);
    }
    updateMessageStatus('accepted');
    setIsJoining(false);
  };

  const handleDeclineInvite = () => {
    updateMessageStatus('declined');
  };

  // 1. STATUS: ACCEPTED (Card disappears & replaced by compact confirmed bar)
  if (currentStatus === 'accepted') {
    return (
      <div className="p-3.5 rounded-2xl bg-emerald-50/95 border border-emerald-200 text-xs text-emerald-900 max-w-sm sm:max-w-md shadow-2xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold leading-tight">
            {isSender
              ? `${receiverDisplayName} telah menerima undangan & bergabung ke grup!`
              : `Anda telah menyetujui dan bergabung ke kelompok "${invite.groupName}"!`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-200/60">
          <span className="text-[10px] text-emerald-700 font-mono">ID Room: {invite.groupId}</span>
          <Link
            to="/learning/study-group"
            onClick={() => setActiveGroupId && invite.groupId && setActiveGroupId(invite.groupId)}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs"
          >
            <span>Buka Group</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  // 2. STATUS: DECLINED (Card disappears & replaced by compact declined notice)
  if (currentStatus === 'declined') {
    return (
      <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 italic max-w-sm animate-in fade-in duration-150">
        {isSender
          ? `Undangan Study Group ke ${receiverDisplayName} telah ditolak.`
          : `Anda telah menolak undangan Study Group "${invite.groupName}".`}
      </div>
    );
  }

  // 3. STATUS: PENDING (Original Interactive Invitation Card)
  return (
    <div className={`p-4 sm:p-4.5 rounded-3xl border-2 text-xs sm:text-sm max-w-sm sm:max-w-md space-y-3.5 shadow-sm transition-all ${
      isSender 
        ? 'bg-slate-900 text-white border-slate-800' 
        : 'bg-white text-slate-800 border-slate-300/90 shadow-md'
    }`}>
      
      {/* Header Badge & Room ID */}
      <div className="flex items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${
          isSender ? 'bg-white/15 text-white' : 'bg-slate-900 text-white shadow-2xs'
        }`}>
          <Users className="w-3.5 h-3.5" />
          <span>{isSender ? 'Undangan Study Group Terkirim' : 'Ajakan Membuat Study Group'}</span>
        </div>

        {invite.groupId && (
          <button
            type="button"
            onClick={handleCopyGroupId}
            className={`text-[10px] font-mono font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${
              isSender ? 'text-slate-300 hover:text-white bg-white/10' : 'text-slate-500 hover:text-slate-800 bg-slate-100'
            }`}
            title="Salin ID Room"
          >
            <span>{invite.groupId}</span>
            {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Main Question & Group Name */}
      <div className="space-y-1.5">
        {isSender ? (
          <div>
            <p className="text-xs text-slate-300">
              Menunggu konfirmasi dari <strong>{receiverDisplayName}</strong> untuk membuat grup:
            </p>
            <h4 className="font-extrabold text-sm sm:text-base mt-1 text-white tracking-tight">
              {invite.groupName}
            </h4>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Apakah <strong>{receiverDisplayName}</strong> ingin membuat kelompok belajar dengan <strong>{inviterDisplayName}</strong>?
            </p>
            <div className="mt-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Nama Kelompok:</span>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate mt-0.5">
                {invite.groupName}
              </h4>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={`pt-3 border-t ${isSender ? 'border-white/10' : 'border-slate-100'}`}>
        {isSender ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Status: Menunggu Konfirmasi</span>
            <Link
              to="/learning/study-group"
              onClick={() => setActiveGroupId && invite.groupId && setActiveGroupId(invite.groupId)}
              className="px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <span>Buka Group</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-[11px] text-slate-500 font-medium">Konfirmasi untuk bergabung sekarang:</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAcceptInvite}
                disabled={isJoining}
                className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isJoining ? 'Menyetujui...' : 'Ya, Buat & Gabung'}</span>
              </button>
              <button
                type="button"
                onClick={handleDeclineInvite}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Tolak
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
