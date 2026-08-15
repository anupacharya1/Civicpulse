import { Award, Crown, Medal, ThumbsUp, Vote, Calendar, Sparkles } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById } from '@/data/sampleData';
import { Card, ProgressBar, SectionHeader } from '@/components/ui';

const rankStyle: Record<number, { ring: string; badge: string; label: string }> = {
  1: { ring: 'ring-amber-400', badge: 'bg-amber-400 text-ink-900', label: '1st Place' },
  2: { ring: 'ring-sand-300', badge: 'bg-sand-200 text-ink-700', label: '2nd Place' },
  3: { ring: 'ring-ink-300', badge: 'bg-ink-200 text-ink-700', label: '3rd Place' },
};

export function StarView() {
  const { stars } = useStore();
  const top3 = stars.slice(0, 3);
  const rest = stars.slice(3);
  const maxScore = stars[0]?.score ?? 1;
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Community Star of the Week</h1>
        <p className="text-sm text-ink-400 mt-1">Recognising residents who contribute meaningfully to community life.</p>
      </div>

      {/* podium */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-ink-700 to-ink-900 p-5 sm:p-7 text-white relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-400/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <Crown size={18} className="text-amber-300" />
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">This Week's Stars</p>
            </div>
            <div className="flex items-end justify-center gap-3 sm:gap-6">
              {podiumOrder.map((idx) => {
                const s = top3[idx];
                if (!s) return null;
                const style = rankStyle[s.rank];
                const heights = ['h-24', 'h-32', 'h-20'];
                const h = idx === 1 ? heights[1] : idx === 0 ? heights[0] : heights[2];
                return (
                  <div key={s.rank} className="flex flex-col items-center" style={{ flex: 1, maxWidth: '180px' }}>
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-ink-800 font-extrabold flex items-center justify-center text-xl sm:text-2xl shadow-soft-lg ring-4 ${style.ring} mb-2`}>
                      {s.name.charAt(0)}
                    </div>
                    <p className="font-bold text-sm text-center truncate w-full">{s.name}</p>
                    <p className="text-xs text-ink-200 text-center">{communityById(s.community).name}</p>
                    <p className="text-amber-300 font-extrabold text-lg mt-1">{s.score}</p>
                    <div className={`mt-2 ${h} w-full rounded-t-xl bg-white/10 border-t-2 border-amber-400/40 flex items-center justify-center`}>
                      <span className="text-2xl font-extrabold text-amber-300/80">#{s.rank}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* top star detail */}
      <Card className="p-5">
        <SectionHeader title="How scores are calculated" icon={<Award size={18} />} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: ThumbsUp, label: 'Useful / verified reports', tone: 'text-danger-500 bg-danger-50' },
            { icon: Vote, label: 'Poll participation', tone: 'text-amber-600 bg-amber-50' },
            { icon: Calendar, label: 'Event & programme attendance', tone: 'text-ink-500 bg-ink-100' },
            { icon: Sparkles, label: 'Useful suggestions', tone: 'text-success-700 bg-success-50' },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${c.tone}`}><Icon size={17} /></div>
                <p className="text-sm font-semibold text-ink-700">{c.label}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-ink-400 mt-3">Scores reward meaningful participation. Spam or duplicate reports are not counted.</p>
      </Card>

      {/* leaderboard table */}
      <Card className="p-5">
        <SectionHeader title="Full Leaderboard" icon={<Medal size={18} />} />
        <div className="space-y-2.5">
          {stars.map((s) => {
            const style = rankStyle[s.rank] ?? { badge: 'bg-sand-100 text-ink-600', label: `#${s.rank}` };
            return (
              <div key={s.rank} className="flex items-center gap-3 p-3 rounded-xl border border-sand-200">
                <div className={`min-w-[40px] h-10 rounded-lg flex items-center justify-center font-extrabold text-sm ${style.badge}`}>
                  {s.rank}
                </div>
                <div className="w-10 h-10 rounded-full bg-sand-100 text-ink-600 font-bold flex items-center justify-center shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-800 truncate">{s.name}</p>
                  <p className="text-xs text-ink-400">{communityById(s.community).name} • {s.badge}</p>
                  <div className="mt-1.5 max-w-xs"><ProgressBar value={(s.score / maxScore) * 100} tone="amber" /></div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-extrabold text-ink-800">{s.score}</p>
                  <p className="text-[10px] text-ink-400 font-medium">points</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
