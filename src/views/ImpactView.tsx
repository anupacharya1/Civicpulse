import {
  Award,
  BookOpen,
  Calendar,
  FileWarning,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Vote,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, ProgressBar, SectionHeader } from '@/components/ui';
import { iconMap } from '@/components/navItems';

const iconMap2: Record<string, typeof Award> = {
  lightbulb: Lightbulb,
  vote: Vote,
  book: BookOpen,
  sparkles: Sparkles,
  users: Users,
  alert: FileWarning,
};

export function ImpactView() {
  const { impact } = useStore();
  const score = impact.communityScore;

  const stats = [
    { label: 'Reports submitted', value: impact.reportsSubmitted, icon: FileWarning, tone: 'text-danger-500 bg-danger-50' },
    { label: 'Useful contributions', value: impact.usefulContributions, icon: TrendingUp, tone: 'text-success-700 bg-success-50' },
    { label: 'Polls participated', value: impact.pollsParticipated, icon: Vote, tone: 'text-amber-600 bg-amber-50' },
    { label: 'Events attended', value: impact.eventsAttended, icon: Calendar, tone: 'text-ink-500 bg-ink-100' },
    { label: 'Programmes attended', value: impact.programmesAttended, icon: BookOpen, tone: 'text-ink-500 bg-ink-100' },
    { label: 'Suggestions submitted', value: impact.suggestionsSubmitted, icon: Sparkles, tone: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">My Weekly Impact</h1>
        <p className="text-sm text-ink-400 mt-1">A summary of your community participation this week.</p>
      </div>

      {/* community score hero */}
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-3">
          <div className="lg:col-span-2 p-5 sm:p-7 bg-gradient-to-br from-ink-700 to-ink-900 text-white relative">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-amber-400/10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Award size={18} className="text-amber-300" />
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Community Score</p>
              </div>
              <p className="text-5xl sm:text-6xl font-extrabold text-amber-300 leading-none">{score}</p>
              <p className="text-sm text-ink-200 mt-2 max-w-sm">Your score reflects meaningful participation — useful reports, poll votes, and event attendance.</p>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-200">Progress to Civic Champion</span>
                  <span className="font-bold text-amber-300">{score}/100</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6 flex flex-col justify-center">
            <SectionHeader title="This Week" icon={<TrendingUp size={18} />} />
            <div className="grid grid-cols-2 gap-3">
              {stats.slice(0, 4).map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="p-3 rounded-xl bg-sand-50 border border-sand-200">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.tone}`}><Icon size={16} /></div>
                    <p className="text-2xl font-extrabold text-ink-800 leading-none">{s.value}</p>
                    <p className="text-xs text-ink-400 mt-1 font-medium">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* full stats grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4 text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2.5 ${s.tone}`}><Icon size={18} /></div>
              <p className="text-2xl font-extrabold text-ink-800">{s.value}</p>
              <p className="text-xs text-ink-400 mt-1 font-medium leading-tight">{s.label}</p>
            </Card>
          );
        })}
      </section>

      {/* timeline + badges */}
      <section className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Weekly Activity Timeline" icon={<Calendar size={18} />} />
          <div className="space-y-0">
            {impact.timeline.map((t, i) => {
              const Icon = iconMap2[t.icon] ?? iconMap[t.icon] ?? Sparkles;
              return (
                <div key={i} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-ink-100 text-ink-600 flex items-center justify-center shrink-0">
                      <Icon size={17} />
                    </div>
                    {i < impact.timeline.length - 1 && <div className="w-px flex-1 bg-sand-200 my-1 min-h-[28px]" />}
                  </div>
                  <div className="pb-5 min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600">{t.day}</p>
                    <p className="text-sm text-ink-700 mt-0.5 leading-snug">{t.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Achievements" icon={<Trophy size={18} />} />
          <div className="space-y-2.5">
            {impact.badges.map((b) => (
              <div
                key={b.name}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  b.earned ? 'bg-amber-50 border-amber-200' : 'bg-sand-50 border-sand-200 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.earned ? 'bg-amber-400 text-ink-900' : 'bg-sand-200 text-ink-400'}`}>
                  <Trophy size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-800">{b.name}</p>
                  <p className="text-xs text-ink-400">{b.earned ? 'Earned' : 'Not yet earned'}</p>
                </div>
                {b.earned && <span className="text-xs font-bold text-amber-600">✓</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-sand-200">
            <p className="text-xs text-ink-400 leading-relaxed">
              Earn badges by contributing meaningfully — submitting useful reports, voting in polls, and attending community events.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
