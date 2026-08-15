import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronRight,
  FileWarning,
  MapPin,
  Megaphone,
  Plus,
  Siren,
  TrendingUp,
  Wrench,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById } from '@/data/sampleData';
import { formatDate, isUpcoming, relativeDate } from '@/utils/format';
import { Badge, Button, Card, ProgressBar, SectionHeader, ViewAllButton } from '@/components/ui';
import { CommunityMap } from '@/components/CommunityMap';
import { WeeklyPoll } from '@/components/WeeklyPoll';
import { AlertBanner } from '@/components/AlertBanner';
import type { ReportStatus } from '@/data/types';

const statusTone: Record<ReportStatus, 'success' | 'amber' | 'neutral'> = {
  Resolved: 'success',
  'In Progress': 'amber',
  Reported: 'neutral',
};

const catIcon: Record<string, string> = {
  Waste: '🗑️',
  Roads: '🛣️',
  Water: '💧',
  Streetlights: '💡',
  Traffic: '🚦',
  'Public Safety': '🛡️',
  Other: '📋',
};

export function HomeView() {
  const {
    selectedCommunity,
    setView,
    setSelectedCommunity,
    reports,
    projects,
    events,
    notices,
    alerts,
    stars,
  } = useStore();

  const community = communityById(selectedCommunity);
  const urgentAlert = alerts[0];

  const communityReports = reports.filter((r) => r.community === selectedCommunity).slice(0, 4);
  const activeReports = reports.filter((r) => r.status !== 'Resolved').slice(0, 4);
  const communityProjects = projects.filter((p) => p.community === selectedCommunity);
  const upcomingEvents = events.filter((e) => isUpcoming(e.date)).slice(0, 3);
  const latestNotices = notices.slice(0, 3);
  const topStar = stars[0];

  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const inProgressCount = reports.filter((r) => r.status === 'In Progress').length;
  const activeProjectCount = projects.filter((p) => p.status !== 'Completed').length;
  const eventCount = events.filter((e) => isUpcoming(e.date)).length;

  const quickActions = [
    { label: 'Report Issue', icon: FileWarning, view: 'reports' as const, tone: 'bg-danger-50 text-danger-500' },
    { label: 'Find Event', icon: Calendar, view: 'events' as const, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Emergency', icon: Siren, view: 'emergency' as const, tone: 'bg-ink-100 text-ink-600' },
    { label: 'My Impact', icon: TrendingUp, view: 'impact' as const, tone: 'bg-success-100 text-success-700' },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* HERO + PULSE */}
      <section className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Hero */}
        <Card className="lg:col-span-2 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900" />
          {/* decorative shapes */}
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-amber-400/10" />
          <div className="absolute right-20 bottom-0 w-28 h-28 rounded-full bg-ink-400/20" />
          <div className="absolute right-6 top-6 opacity-20">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <path d="M20 70c12-9 24-9 36 0s24 9 36 0" stroke="#df9d36" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <circle cx="60" cy="46" r="12" fill="#df9d36" opacity="0.5" />
              <path d="M60 34v-8M74 46h8M46 46h-8M70 40l5-5M50 40l-5-5" stroke="#df9d36" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>

          <div className="relative p-5 sm:p-7 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Badge tone="amber" className="bg-amber-400/20 text-amber-200">
                <Sparkles size={12} /> Prototype
              </Badge>
              <span className="text-xs text-ink-200 font-medium">Society &amp; Daily Life</span>
            </div>
            <h1 className="font-display-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Civic
              <span className="text-amber-300">Pulse</span>
            </h1>
            <p className="font-display-serif italic text-lg sm:text-xl text-ink-100 mt-3 max-w-lg leading-snug">
              What's happening in your community, today.
            </p>
            <p className="text-ink-200 mt-2 text-sm sm:text-[15px] max-w-lg leading-relaxed">
              Reports, development, events, notices, and community participation — all in one calm, trustworthy place.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-5">
              <Button variant="amber" onClick={() => setView('reports')} className="flex items-center gap-1.5">
                <Plus size={16} /> Report an Issue
              </Button>
              <Button
                variant="secondary"
                onClick={() => setView('pulse')}
                className="bg-white/10 text-white border-white/20 hover:bg-white/15 flex items-center gap-1.5"
              >
                <Activity size={16} /> Community Pulse
              </Button>
            </div>

            {/* mini stats row */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/15">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-amber-300">{activeReports.length}</p>
                <p className="text-[11px] sm:text-xs text-ink-200 font-medium">Active reports</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-amber-300">{activeProjectCount}</p>
                <p className="text-[11px] sm:text-xs text-ink-200 font-medium">Ongoing projects</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-amber-300">{eventCount}</p>
                <p className="text-[11px] sm:text-xs text-ink-200 font-medium">Upcoming events</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Community pulse mini */}
        <Card className="p-5 flex flex-col">
          <SectionHeader
            title="Community Pulse"
            icon={<Activity size={18} />}
            action={<ViewAllButton onClick={() => setView('pulse')} />}
          />
          <div className="flex items-center gap-2 mb-4">
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value as typeof selectedCommunity)}
              className="flex-1 bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-sm font-bold text-ink-700 focus:border-ink-400 outline-none"
            >
              {[
                'sundarghat',
                'shantipur',
                'pragati-tole',
                'sajha-nagar',
                'samunnati-nagar',
                'maitri-tole',
              ].map((id) => (
                <option key={id} value={id}>
                  {communityById(id).name}
                </option>
              ))}
            </select>
            <Badge
              tone={community.status === 'Good' ? 'success' : community.status === 'Stable' ? 'amber' : 'danger'}
            >
              {community.status}
            </Badge>
          </div>

          <div className="space-y-2.5 text-sm flex-1">
            <PulseRow label="Waste collection" value={community.services.wasteCollection} />
            <PulseRow label="Road maintenance" value={community.services.roadMaintenance} />
            <PulseRow label="Streetlights" value={community.services.streetlights} />
            <PulseRow label="Water supply" value={community.services.waterSupply} />
          </div>

          <div className="mt-4 pt-4 border-t border-sand-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-ink-600">Development progress</span>
              <span className="font-bold text-ink-800">{community.developmentProgress}%</span>
            </div>
            <ProgressBar value={community.developmentProgress} tone="amber" />
          </div>
        </Card>
      </section>

      {/* ALERT + QUICK ACTIONS + POLL */}
      <section className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="space-y-3">
          <SectionHeader title="Important Alert" icon={<AlertTriangle size={18} />} />
          {urgentAlert ? (
            <AlertBanner alert={urgentAlert} />
          ) : (
            <Card className="p-4 text-sm text-ink-400">No active alerts right now.</Card>
          )}
        </div>

        <Card className="p-5">
          <SectionHeader title="Quick Actions" icon={<Sparkles size={18} />} />
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={() => setView(a.view)}
                  className="flex flex-col items-start gap-2 p-3 rounded-xl border border-sand-200 hover:border-ink-300 hover:shadow-soft transition-all text-left"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.tone}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-semibold text-ink-700">{a.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <WeeklyPoll />
        </Card>
      </section>

      {/* MAP + STATS */}
      <section className="grid lg:grid-cols-5 gap-4 sm:gap-5">
        <Card className="lg:col-span-3 p-5">
          <SectionHeader
            title="Community Map"
            subtitle="Tap a community to view its pulse"
            icon={<MapPin size={18} />}
            action={<ViewAllButton onClick={() => setView('pulse')} />}
          />
          <CommunityMap />
        </Card>

        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Community at a Glance" icon={<TrendingUp size={18} />} />
          <div className="grid grid-cols-2 gap-3">
            <StatBox value={reports.length} label="Total reports" icon={<FileWarning size={16} />} tone="text-danger-500 bg-danger-50" />
            <StatBox value={resolvedCount} label="Resolved" icon={<CheckCircle2 size={16} />} tone="text-success-700 bg-success-50" />
            <StatBox value={inProgressCount} label="In progress" icon={<Clock size={16} />} tone="text-amber-600 bg-amber-50" />
            <StatBox value={projects.length} label="Projects" icon={<Wrench size={16} />} tone="text-ink-500 bg-ink-100" />
          </div>

          {/* star highlight */}
          <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-sand-100 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <TrophyIcon />
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Star of the Week</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-400 text-ink-900 font-extrabold flex items-center justify-center text-lg shadow-soft">
                {topStar.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-ink-800 truncate">{topStar.name}</p>
                <p className="text-xs text-ink-400">{communityById(topStar.community).name} • {topStar.score} pts</p>
              </div>
            </div>
            <button
              onClick={() => setView('star')}
              className="mt-2.5 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              See leaderboard <ArrowRight size={12} />
            </button>
          </div>
        </Card>
      </section>

      {/* ACTIVE REPORTS + DEVELOPMENT */}
      <section className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <Card className="p-5">
          <SectionHeader
            title="Active Community Issues"
            subtitle={communityById(selectedCommunity).name}
            icon={<FileWarning size={18} />}
            action={<ViewAllButton onClick={() => setView('reports')} />}
          />
          <div className="space-y-2.5">
            {communityReports.length > 0 ? (
              communityReports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setView('reports')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-sand-200 hover:border-ink-300 hover:shadow-soft transition-all text-left"
                >
                  <span className="text-xl shrink-0">{catIcon[r.category]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-800 truncate">{r.title}</p>
                    <p className="text-xs text-ink-400">{formatDate(r.date)} • {r.category}</p>
                  </div>
                  <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                </button>
              ))
            ) : (
              <p className="text-sm text-ink-400 py-4 text-center">No reports in this community yet.</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader
            title="Development Progress"
            subtitle={communityById(selectedCommunity).name}
            icon={<Wrench size={18} />}
            action={<ViewAllButton onClick={() => setView('development')} />}
          />
          <div className="space-y-3.5">
            {communityProjects.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => setView('development')}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-ink-800 truncate pr-2">{p.name}</p>
                  <span className="text-xs font-bold text-ink-700">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} tone={p.progress >= 80 ? 'success' : 'ink'} />
                <p className="text-xs text-ink-400 mt-1">{p.status} • {formatDate(p.expectedCompletion)}</p>
              </button>
            ))}
            {communityProjects.length === 0 && (
              <p className="text-sm text-ink-400 py-4 text-center">No active projects in this community.</p>
            )}
          </div>
        </Card>
      </section>

      {/* EVENTS + NOTICES */}
      <section className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <Card className="p-5">
          <SectionHeader
            title="Upcoming Events"
            icon={<Calendar size={18} />}
            action={<ViewAllButton onClick={() => setView('events')} />}
          />
          <div className="space-y-2">
            {upcomingEvents.map((e) => (
              <button
                key={e.id}
                onClick={() => setView('events')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-sand-200 hover:border-ink-300 hover:shadow-soft transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-ink-700 text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase text-amber-300 leading-none">
                    {new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-extrabold leading-none mt-0.5">
                    {new Date(e.date + 'T00:00:00').getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800 truncate">{e.title}</p>
                  <p className="text-xs text-ink-400 truncate">{e.time} • {communityById(e.community).name}</p>
                </div>
                <ChevronRight size={16} className="text-ink-300 shrink-0" />
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader
            title="Latest Notices"
            icon={<Megaphone size={18} />}
            action={<ViewAllButton onClick={() => setView('notices')} />}
          />
          <div className="space-y-2">
            {latestNotices.map((n) => (
              <button
                key={n.id}
                onClick={() => setView('notices')}
                className="w-full flex items-start gap-3 p-3 rounded-xl border border-sand-200 hover:border-ink-300 hover:shadow-soft transition-all text-left"
              >
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.important ? 'bg-amber-400' : 'bg-ink-300'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800 truncate">{n.title}</p>
                  <p className="text-xs text-ink-400 mt-0.5 line-clamp-2">{n.body}</p>
                </div>
                <Badge tone="neutral" className="shrink-0">{n.category}</Badge>
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function PulseRow({ label, value }: { label: string; value: string }) {
  const tone =
    value === 'Normal' || value === 'All functioning'
      ? 'text-success-600'
      : value === 'In Progress' || value === 'Limited' || value === 'Delayed'
        ? 'text-amber-600'
        : value === 'Planned'
          ? 'text-ink-500'
          : 'text-danger-500';
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-ink-500 text-xs sm:text-sm">{label}</span>
      <span className={`font-semibold text-xs sm:text-sm ${tone}`}>{value}</span>
    </div>
  );
}

function StatBox({
  value,
  label,
  icon,
  tone,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${tone}`}>{icon}</div>
      <p className="text-2xl font-extrabold text-ink-800 leading-none">{value}</p>
      <p className="text-xs text-ink-400 mt-1 font-medium">{label}</p>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 4h12v3a6 6 0 01-12 0V4z" stroke="#c8821f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 5H3v2a3 3 0 003 3M18 5h3v2a3 3 0 01-3 3M9 16h6M10 19h4M8 19a4 4 0 008 0" stroke="#c8821f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}


