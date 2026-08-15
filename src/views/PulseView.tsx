import {
  Activity,
  CheckCircle2,
  Clock,
  Droplets,
  FileWarning,
  Lightbulb,
  MapPin,
  Megaphone,
  Recycle,
  Route,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById, communities } from '@/data/sampleData';
import { formatDate, isUpcoming } from '@/utils/format';
import { Badge, Card, ProgressBar, SectionHeader } from '@/components/ui';
import { CommunityMap } from '@/components/CommunityMap';

const statusTone: Record<string, 'success' | 'amber' | 'danger'> = {
  Good: 'success',
  Stable: 'amber',
  'Needs Attention': 'danger',
};

export function PulseView() {
  const { selectedCommunity, setSelectedCommunity, reports, projects, events, notices, setView } = useStore();
  const community = communityById(selectedCommunity);

  const communityReports = reports.filter((r) => r.community === selectedCommunity);
  const communityProjects = projects.filter((p) => p.community === selectedCommunity);
  const communityEvents = events.filter((e) => e.community === selectedCommunity && isUpcoming(e.date));
  const communityNotices = notices.filter((n) => n.community === selectedCommunity || n.community === 'all');

  const activeReports = communityReports.filter((r) => r.status !== 'Resolved').length;
  const resolvedReports = communityReports.filter((r) => r.status === 'Resolved').length;

  const recentActivity = [
    ...communityReports.slice(0, 3).map((r) => ({
      icon: FileWarning,
      text: `Report: ${r.title}`,
      date: r.date,
      tone: r.status === 'Resolved' ? 'text-success-600' : 'text-danger-500',
    })),
    ...communityProjects.slice(0, 2).map((p) => ({
      icon: Wrench,
      text: `Project: ${p.name} (${p.progress}%)`,
      date: p.expectedCompletion,
      tone: 'text-ink-500',
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const serviceIcons: Record<string, typeof Recycle> = {
    waste: Recycle,
    road: Route,
    streetlights: Lightbulb,
    water: Droplets,
  };

  const services = [
    { key: 'waste', label: 'Waste Collection', value: community.services.wasteCollection, icon: serviceIcons.waste },
    { key: 'road', label: 'Road Maintenance', value: community.services.roadMaintenance, icon: serviceIcons.road },
    { key: 'lights', label: 'Streetlights', value: community.services.streetlights, icon: serviceIcons.streetlights },
    { key: 'water', label: 'Water Supply', value: community.services.waterSupply, icon: serviceIcons.water },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* Community selector row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {communities.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCommunity(c.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
              c.id === selectedCommunity
                ? 'bg-ink-700 text-white border-ink-700 shadow-soft'
                : 'bg-white text-ink-600 border-sand-200 hover:border-ink-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Community header card */}
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-3">
          <div className="lg:col-span-2 p-5 sm:p-7 bg-gradient-to-br from-ink-700 to-ink-900 text-white relative">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-amber-400/10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-amber-300" />
                <Badge tone={statusTone[community.status]} className="bg-white/15 text-white">
                  {community.status}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{community.name}</h1>
              <p className="text-ink-200 mt-1.5 text-sm sm:text-base">{community.tagline}</p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-2xl font-extrabold text-amber-300">{community.households}</p>
                  <p className="text-xs text-ink-200 font-medium">Households</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-amber-300">{community.population.toLocaleString()}</p>
                  <p className="text-xs text-ink-200 font-medium">Residents</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-amber-300">{community.developmentProgress}%</p>
                  <p className="text-xs text-ink-200 font-medium">Dev. progress</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-200 font-medium">Overall development</span>
                  <span className="font-bold text-amber-300">{community.developmentProgress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${community.developmentProgress}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <SectionHeader title="Community Map" icon={<MapPin size={18} />} />
            <CommunityMap compact />
          </div>
        </div>
      </Card>

      {/* Services grid */}
      <section>
        <SectionHeader title="Public Services Status" icon={<Activity size={18} />} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {services.map((s) => {
            const Icon = s.icon;
            const tone =
              s.value === 'Normal' || s.value === 'All functioning'
                ? 'success'
                : s.value === 'In Progress' || s.value === 'Limited' || s.value === 'Delayed'
                  ? 'amber'
                  : s.value === 'Planned'
                    ? 'neutral'
                    : 'danger';
            return (
              <Card key={s.key} className="p-4">
                <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-ink-500 mb-3">
                  <Icon size={20} />
                </div>
                <p className="text-xs text-ink-400 font-medium mb-1">{s.label}</p>
                <p className="text-sm font-bold text-ink-800">{s.value}</p>
                <div className="mt-2">
                  <Badge tone={tone}>
                    {s.value === 'Normal' || s.value === 'All functioning'
                      ? 'Operating'
                      : s.value === 'Planned'
                        ? 'Planned'
                        : 'Attention'}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats + recent activity */}
      <section className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Reports & Development" icon={<TrendingUp size={18} />} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <StatTile value={communityReports.length} label="Total reports" tone="text-danger-500" />
            <StatTile value={activeReports} label="Active" tone="text-amber-600" />
            <StatTile value={resolvedReports} label="Resolved" tone="text-success-600" />
            <StatTile value={communityProjects.length} label="Projects" tone="text-ink-500" />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Development projects</p>
            {communityProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => setView('development')}
                className="w-full text-left p-3 rounded-xl border border-sand-200 hover:border-ink-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-ink-800 truncate pr-2">{p.name}</p>
                  <span className="text-xs font-bold text-ink-700">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} tone={p.progress >= 80 ? 'success' : 'ink'} />
                <p className="text-xs text-ink-400 mt-1">{p.status} • by {formatDate(p.expectedCompletion)}</p>
              </button>
            ))}
            {communityProjects.length === 0 && (
              <p className="text-sm text-ink-400 py-3 text-center">No projects in this community.</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Recent Activity" icon={<Clock size={18} />} />
          <div className="space-y-3">
            {recentActivity.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center ${a.tone}`}>
                      <Icon size={15} />
                    </div>
                    {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-sand-200 my-1" />}
                  </div>
                  <div className="pb-1 min-w-0">
                    <p className="text-sm text-ink-700 leading-snug">{a.text}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{formatDate(a.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Events + notices */}
      <section className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <Card className="p-5">
          <SectionHeader title="Upcoming Events" icon={<Users size={18} />} action={
            <button onClick={() => setView('events')} className="text-sm font-semibold text-ink-500 hover:text-ink-700">View all</button>
          } />
          <div className="space-y-2">
            {communityEvents.slice(0, 3).map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl border border-sand-200">
                <div className="w-11 h-11 rounded-xl bg-ink-50 text-ink-700 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold uppercase text-amber-600 leading-none">{new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-base font-extrabold leading-none mt-0.5">{new Date(e.date + 'T00:00:00').getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800 truncate">{e.title}</p>
                  <p className="text-xs text-ink-400">{e.time}</p>
                </div>
              </div>
            ))}
            {communityEvents.length === 0 && <p className="text-sm text-ink-400 py-3 text-center">No upcoming events.</p>}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Important Notices" icon={<Megaphone size={18} />} action={
            <button onClick={() => setView('notices')} className="text-sm font-semibold text-ink-500 hover:text-ink-700">View all</button>
          } />
          <div className="space-y-2">
            {communityNotices.slice(0, 3).map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl border border-sand-200">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.important ? 'bg-amber-400' : 'bg-ink-300'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800 truncate">{n.title}</p>
                  <p className="text-xs text-ink-400 mt-0.5 line-clamp-2">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatTile({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
      <p className={`text-2xl font-extrabold ${tone} leading-none`}>{value}</p>
      <p className="text-xs text-ink-400 mt-1 font-medium">{label}</p>
    </div>
  );
}


