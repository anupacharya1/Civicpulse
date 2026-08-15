import { useMemo, useState } from 'react';
import { Building2, CheckCircle2, MapPin, Wrench, Calendar, Wallet } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById, communities } from '@/data/sampleData';
import { formatDate } from '@/utils/format';
import { Badge, Card, Modal, ProgressBar, SectionHeader } from '@/components/ui';
import type { Project, ProjectStatus } from '@/data/types';

const statusTone: Record<ProjectStatus, 'success' | 'amber' | 'neutral' | 'ink'> = {
  Completed: 'success',
  'Near Completion': 'amber',
  'In Progress': 'ink',
  Planning: 'neutral',
};

export function DevelopmentView() {
  const { projects } = useStore();
  const [filterCommunity, setFilterCommunity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const statuses: ProjectStatus[] = ['Planning', 'In Progress', 'Near Completion', 'Completed'];

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (filterCommunity !== 'all' && p.community !== filterCommunity) return false;
        if (filterStatus !== 'all' && p.status !== filterStatus) return false;
        return true;
      }),
    [projects, filterCommunity, filterStatus],
  );

  const avgProgress = Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length);
  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const ongoingCount = projects.filter((p) => p.status !== 'Completed').length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Development Works</h1>
        <p className="text-sm text-ink-400 mt-1">Track ongoing community development projects and their progress.</p>
      </div>

      {/* overview stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4">
          <p className="text-3xl font-extrabold text-ink-700">{projects.length}</p>
          <p className="text-xs text-ink-400 font-medium mt-1">Total projects</p>
        </Card>
        <Card className="p-4">
          <p className="text-3xl font-extrabold text-amber-600">{ongoingCount}</p>
          <p className="text-xs text-ink-400 font-medium mt-1">Ongoing</p>
        </Card>
        <Card className="p-4">
          <p className="text-3xl font-extrabold text-success-600">{completedCount}</p>
          <p className="text-xs text-ink-400 font-medium mt-1">Completed</p>
        </Card>
      </div>

      {/* average progress banner */}
      <Card className="p-5 bg-gradient-to-br from-ink-700 to-ink-900 text-white border-ink-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-amber-300" />
            <p className="font-bold">Average progress across all projects</p>
          </div>
          <p className="text-2xl font-extrabold text-amber-300">{avgProgress}%</p>
        </div>
        <div className="h-3 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${avgProgress}%` }} />
        </div>
      </Card>

      {/* filters */}
      <div className="flex flex-wrap gap-2">
        <select value={filterCommunity} onChange={(e) => setFilterCommunity(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-sand-200 text-sm font-semibold text-ink-700 outline-none">
          <option value="all">All communities</option>
          {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-sand-200 text-sm font-semibold text-ink-700 outline-none">
          <option value="all">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* project cards */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
        {filtered.map((p) => (
          <Card key={p.id} hover onClick={() => setSelected(p)} className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-ink-100 text-ink-600 flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink-800 leading-snug">{p.name}</p>
                  <p className="text-xs text-ink-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={12} /> {communityById(p.community).name} • {p.location}
                  </p>
                </div>
              </div>
              <Badge tone={statusTone[p.status]}>{p.status}</Badge>
            </div>
            <p className="text-sm text-ink-500 line-clamp-2 mb-3">{p.description}</p>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-ink-600">Progress</span>
              <span className="font-bold text-ink-800">{p.progress}%</span>
            </div>
            <ProgressBar value={p.progress} tone={p.progress >= 80 ? 'success' : p.progress >= 40 ? 'ink' : 'amber'} />
            <p className="text-xs text-ink-400 mt-2 flex items-center gap-1">
              <Calendar size={12} /> Expected by {formatDate(p.expectedCompletion)}
            </p>
          </Card>
        ))}
      </div>

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Project Details" size="lg">
          <ProjectDetail project={selected} />
        </Modal>
      )}
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const community = communityById(project.community);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge tone={statusTone[project.status]}>{project.status}</Badge>
        <Badge tone="neutral">{project.category}</Badge>
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink-800 leading-tight">{project.name}</h3>
        <p className="text-sm text-ink-400 mt-1 flex items-center gap-1">
          <MapPin size={14} /> {community.name} • {project.location}
        </p>
      </div>
      <p className="text-sm text-ink-600 leading-relaxed">{project.description}</p>

      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-ink-600">Progress</span>
          <span className="font-bold text-ink-800">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} tone={project.progress >= 80 ? 'success' : 'ink'} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
          <p className="text-xs text-ink-400 flex items-center gap-1"><Calendar size={12} /> Expected completion</p>
          <p className="text-sm font-bold text-ink-800 mt-1">{formatDate(project.expectedCompletion)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
          <p className="text-xs text-ink-400 flex items-center gap-1"><Wallet size={12} /> Budget</p>
          <p className="text-sm font-bold text-ink-800 mt-1">{project.budget}</p>
        </div>
      </div>

      {project.status === 'Completed' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 border border-success-100 text-sm font-semibold text-success-700">
          <CheckCircle2 size={18} /> This project has been completed.
        </div>
      )}
    </div>
  );
}
