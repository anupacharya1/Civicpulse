import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  FileWarning,
  Filter,
  Plus,
  Search,
  ThumbsUp,
  X,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById, communities } from '@/data/sampleData';
import { formatDate } from '@/utils/format';
import { Badge, Button, Card, EmptyState, Modal, SectionHeader } from '@/components/ui';
import type { Priority, Report, ReportCategory, ReportStatus } from '@/data/types';

const statusTone: Record<ReportStatus, 'success' | 'amber' | 'neutral'> = {
  Resolved: 'success',
  'In Progress': 'amber',
  Reported: 'neutral',
};
const priorityTone: Record<Priority, 'danger' | 'amber' | 'neutral'> = {
  High: 'danger',
  Medium: 'amber',
  Low: 'neutral',
};
const categories: ReportCategory[] = ['Waste', 'Roads', 'Water', 'Streetlights', 'Traffic', 'Public Safety', 'Other'];
const statuses: ReportStatus[] = ['Reported', 'In Progress', 'Resolved'];

const catEmoji: Record<string, string> = {
  Waste: '🗑️', Roads: '🛣️', Water: '💧', Streetlights: '💡', Traffic: '🚦', 'Public Safety': '🛡️', Other: '📋',
};

export function ReportsView() {
  const { reports, addReport, upvoteReport } = useStore();
  const [query, setQuery] = useState('');
  const [filterCommunity, setFilterCommunity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'upvotes'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    let out = reports.filter((r) => {
      if (query && !r.title.toLowerCase().includes(query.toLowerCase()) && !r.description.toLowerCase().includes(query.toLowerCase())) return false;
      if (filterCommunity !== 'all' && r.community !== filterCommunity) return false;
      if (filterCategory !== 'all' && r.category !== filterCategory) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      return true;
    });
    out = [...out].sort((a, b) =>
      sortBy === 'upvotes' ? b.upvotes - a.upvotes : b.date.localeCompare(a.date),
    );
    return out;
  }, [reports, query, filterCommunity, filterCategory, filterStatus, sortBy]);

  const activeFilterCount = [filterCommunity, filterCategory, filterStatus].filter((f) => f !== 'all').length;

  const clearFilters = () => {
    setFilterCommunity('all'); setFilterCategory('all'); setFilterStatus('all'); setQuery('');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Community Reports</h1>
          <p className="text-sm text-ink-400 mt-1">View, search, and report everyday community problems.</p>
        </div>
        <Button variant="amber" onClick={() => setShowForm(true)} className="flex items-center gap-1.5">
          <Plus size={16} /> New Report
        </Button>
      </div>

      {/* search + filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-sand-200 text-sm text-ink-700 focus:border-ink-400 outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${
            showFilters || activeFilterCount > 0 ? 'bg-ink-700 text-white border-ink-700' : 'bg-white text-ink-600 border-sand-200'
          }`}
        >
          <Filter size={16} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-ink-900 text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </div>

      {/* filters */}
      {showFilters && (
        <Card className="p-4 animate-fade-in">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FilterSelect label="Community" value={filterCommunity} onChange={setFilterCommunity} options={[{ value: 'all', label: 'All communities' }, ...communities.map((c) => ({ value: c.id, label: c.name }))]} />
            <FilterSelect label="Category" value={filterCategory} onChange={setFilterCategory} options={[{ value: 'all', label: 'All categories' }, ...categories.map((c) => ({ value: c, label: c }))]} />
            <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus} options={[{ value: 'all', label: 'All statuses' }, ...statuses.map((s) => ({ value: s, label: s }))]} />
            <div>
              <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Sort by</label>
              <button
                onClick={() => setSortBy((s) => (s === 'recent' ? 'upvotes' : 'recent'))}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-sm font-semibold text-ink-700"
              >
                {sortBy === 'recent' ? 'Most recent' : 'Most upvoted'}
                <ArrowUpDown size={15} className="text-ink-400" />
              </button>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mt-3 text-sm font-semibold text-danger-500 hover:text-danger-600 flex items-center gap-1">
              <X size={14} /> Clear all filters
            </button>
          )}
        </Card>
      )}

      {/* results count */}
      <p className="text-sm text-ink-400">
        {filtered.length} report{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* report list */}
      {filtered.length === 0 ? (
        <Card className="py-8">
          <EmptyState icon={<FileWarning size={26} />} title="No reports found" message="Try adjusting your filters or search terms." />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {filtered.map((r) => (
            <Card key={r.id} hover onClick={() => setSelected(r)} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{catEmoji[r.category]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                    <Badge tone={priorityTone[r.priority]}>{r.priority} priority</Badge>
                  </div>
                  <p className="text-sm font-bold text-ink-800 leading-snug">{r.title}</p>
                  <p className="text-xs text-ink-400 mt-1 line-clamp-2">{r.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand-100">
                    <span className="text-xs text-ink-400">{communityById(r.community).name} • {formatDate(r.date)}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-ink-500">
                      <ThumbsUp size={13} /> {r.upvotes}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* detail modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Report Details" size="lg">
          <ReportDetail report={selected} onUpvote={() => { upvoteReport(selected.id); setSelected({ ...selected, upvotes: selected.upvotes + 1 }); }} />
        </Modal>
      )}

      {/* submission form */}
      {showForm && (
        <Modal open={showForm} onClose={() => setShowForm(false)} title="Submit a New Report" size="lg">
          <ReportForm
            onSubmit={(r) => { addReport(r); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-xs font-semibold text-ink-500 mb-1.5 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-sm font-semibold text-ink-700 focus:border-ink-400 outline-none">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ReportDetail({ report, onUpvote }: { report: Report; onUpvote: () => void }) {
  const community = communityById(report.community);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge tone={statusTone[report.status]}>{report.status}</Badge>
        <Badge tone={priorityTone[report.priority]}>{report.priority} priority</Badge>
        <Badge tone="neutral">{report.category}</Badge>
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink-800 leading-tight">{report.title}</h3>
        <p className="text-sm text-ink-400 mt-1">{community.name} • {formatDate(report.date)}</p>
      </div>
      <p className="text-sm text-ink-600 leading-relaxed">{report.description}</p>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-center">
          <p className="text-xs text-ink-400">Reported by</p>
          <p className="text-sm font-bold text-ink-800 mt-0.5">{report.reporter}</p>
        </div>
        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-center">
          <p className="text-xs text-ink-400">Upvotes</p>
          <p className="text-sm font-bold text-ink-800 mt-0.5">{report.upvotes}</p>
        </div>
        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-center">
          <p className="text-xs text-ink-400">Status</p>
          <p className="text-sm font-bold text-ink-800 mt-0.5">{report.status}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="secondary" onClick={onUpvote} className="flex items-center gap-1.5">
          <ThumbsUp size={16} /> Upvote this report
        </Button>
      </div>
      <p className="text-xs text-ink-300">This is a prototype — upvotes are stored locally in your browser.</p>
    </div>
  );
}

function ReportForm({ onSubmit, onCancel }: { onSubmit: (r: Omit<Report, 'id' | 'date' | 'upvotes'>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [community, setCommunity] = useState<Report['community']>('sundarghat');
  const [category, setCategory] = useState<ReportCategory>('Waste');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [description, setDescription] = useState('');
  const [reporter, setReporter] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!title.trim() || !description.trim()) {
      setError('Please fill in the title and description.');
      return;
    }
    onSubmit({
      title: title.trim(),
      community,
      category,
      priority,
      description: description.trim(),
      status: 'Reported',
      reporter: reporter.trim() || 'Anonymous',
    });
  };

  return (
    <div className="space-y-4">
      <Field label="Report title" required>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Pothole on the main road" className="form-input" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Community" required>
          <select value={community} onChange={(e) => setCommunity(e.target.value as Report['community'])} className="form-input">
            {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Category" required>
          <select value={category} onChange={(e) => setCategory(e.target.value as ReportCategory)} className="form-input">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Priority">
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="form-input">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </Field>
        <Field label="Your name (optional)">
          <input value={reporter} onChange={(e) => setReporter(e.target.value)} placeholder="Anonymous" className="form-input" />
        </Field>
      </div>
      <Field label="Description" required>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the problem in detail — location, when it started, who is affected…" rows={4} className="form-input resize-none" />
      </Field>
      {error && <p className="text-sm text-danger-500 font-semibold">{error}</p>}
      <div className="flex gap-2 justify-end pt-1">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={submit}>Submit Report</Button>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-ink-500 mb-1.5 block">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      {children}
    </div>
  );
}
