import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import type { Alert } from '@/data/types';
import { communityById } from '@/data/sampleData';

const config = {
  Urgent: { icon: AlertTriangle, color: 'text-danger-500', bg: 'bg-danger-50', border: 'border-danger-100', label: 'Urgent' },
  Important: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Important' },
  Information: { icon: Info, color: 'text-ink-500', bg: 'bg-ink-50', border: 'border-ink-100', label: 'Information' },
};

export function AlertBanner({ alert }: { alert: Alert }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const c = config[alert.priority];
  const Icon = c.icon;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl border ${c.bg} ${c.border}`}>
      <div className={`shrink-0 mt-0.5 ${c.color}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-sm text-ink-800">{alert.title}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${c.color}`}>{c.label}</span>
        </div>
        <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{alert.message}</p>
        {alert.community !== 'all' && (
          <p className="text-[11px] text-ink-400 mt-1 font-medium">{communityById(alert.community).name}</p>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 w-7 h-7 rounded-full hover:bg-white/60 flex items-center justify-center text-ink-400"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  );
}
