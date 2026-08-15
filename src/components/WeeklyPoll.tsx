import { CheckCircle2, BarChart3 } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { pollOptions, pollQuestion } from '@/data/sampleData';
import { ProgressBar } from '@/components/ui';

export function WeeklyPoll({ compact = false }: { compact?: boolean }) {
  const { pollVotes, pollVoted, votePoll, totalVotes } = useStore();

  return (
    <div>
      <div className="flex items-start gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <BarChart3 size={16} />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Weekly Poll</p>
          <p className="text-sm font-bold text-ink-800 leading-tight mt-0.5">{pollQuestion}</p>
        </div>
      </div>

      {pollVoted ? (
        <div className="space-y-2.5">
          {pollOptions.map((opt) => {
            const pct = totalVotes > 0 ? Math.round(((pollVotes[opt.id] ?? 0) / totalVotes) * 100) : 0;
            const chosen = pollVoted === opt.id;
            return (
              <div key={opt.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold flex items-center gap-1.5 ${chosen ? 'text-amber-600' : 'text-ink-600'}`}>
                    {chosen && <CheckCircle2 size={13} />}
                    {opt.label}
                  </span>
                  <span className="font-bold text-ink-700">{pct}%</span>
                </div>
                <ProgressBar value={pct} tone="amber" />
              </div>
            );
          })}
          <p className="text-[11px] text-ink-400 pt-1">{totalVotes.toLocaleString()} total votes</p>
        </div>
      ) : (
        <div className={`grid ${compact ? 'gap-1.5' : 'gap-2'}`}>
          {pollOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => votePoll(opt.id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-sand-200 hover:border-amber-300 hover:bg-amber-50 text-left transition-colors group"
            >
              <span className="w-4 h-4 rounded-full border-2 border-sand-300 group-hover:border-amber-400 transition-colors shrink-0" />
              <span className="text-sm font-medium text-ink-700">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
