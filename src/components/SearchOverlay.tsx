import { useMemo, useState } from 'react';
import { Search, X, FileWarning, Wrench, Megaphone, Calendar, MapPin } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById, communities } from '@/data/sampleData';

interface Result {
  id: string;
  type: 'Report' | 'Project' | 'Event' | 'Notice' | 'Community';
  title: string;
  subtitle: string;
  community: string;
  icon: typeof Search;
  view: 'reports' | 'development' | 'events' | 'notices' | 'pulse';
}

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { reports, projects, events, notices, setView, setSelectedCommunity } = useStore();
  const [query, setQuery] = useState('');

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: Result[] = [];

    reports.forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        communityById(r.community).name.toLowerCase().includes(q)
      ) {
        out.push({
          id: r.id,
          type: 'Report',
          title: r.title,
          subtitle: `${r.category} • ${r.status}`,
          community: communityById(r.community).name,
          icon: FileWarning,
          view: 'reports',
        });
      }
    });

    projects.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        communityById(p.community).name.toLowerCase().includes(q)
      ) {
        out.push({
          id: p.id,
          type: 'Project',
          title: p.name,
          subtitle: `${p.status} • ${p.progress}% complete`,
          community: communityById(p.community).name,
          icon: Wrench,
          view: 'development',
        });
      }
    });

    events.forEach((e) => {
      if (
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        communityById(e.community).name.toLowerCase().includes(q)
      ) {
        out.push({
          id: e.id,
          type: 'Event',
          title: e.title,
          subtitle: `${e.date} • ${e.time}`,
          community: communityById(e.community).name,
          icon: Calendar,
          view: 'events',
        });
      }
    });

    notices.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)) {
        out.push({
          id: n.id,
          type: 'Notice',
          title: n.title,
          subtitle: n.category,
          community: n.community === 'all' ? 'All communities' : communityById(n.community).name,
          icon: Megaphone,
          view: 'notices',
        });
      }
    });

    communities.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)) {
        out.push({
          id: c.id,
          type: 'Community',
          title: c.name,
          subtitle: c.tagline,
          community: c.name,
          icon: MapPin,
          view: 'pulse',
        });
      }
    });

    return out.slice(0, 20);
  }, [query, reports, projects, events, notices]);

  const open = (r: Result) => {
    if (r.type === 'Community') {
      const c = communities.find((c) => c.name === r.community);
      if (c) setSelectedCommunity(c.id);
    }
    setView(r.view);
    onClose();
  };

  const typeColors: Record<string, string> = {
    Report: 'text-danger-500 bg-danger-50',
    Project: 'text-ink-500 bg-ink-100',
    Event: 'text-amber-600 bg-amber-50',
    Notice: 'text-success-600 bg-success-50',
    Community: 'text-ink-500 bg-ink-100',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-soft-xl w-full max-w-xl overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-sand-200">
          <Search size={20} className="text-ink-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports, projects, events, notices…"
            className="flex-1 text-base bg-transparent outline-none text-ink-800 placeholder:text-ink-300"
          />
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-sand-100 flex items-center justify-center text-ink-400" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="px-4 py-6 text-sm text-ink-400">
              <p className="font-semibold text-ink-600 mb-2">Search across CivicPulse</p>
              <p>Find reports, development projects, events, notices, and communities in one place.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-ink-400">
              No results for “{query}”.
            </div>
          ) : (
            <div className="py-2">
              {results.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={`${r.type}-${r.id}`}
                    onClick={() => open(r)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sand-50 text-left transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeColors[r.type]}`}>
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink-800 truncate">{r.title}</p>
                      <p className="text-xs text-ink-400 truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-300 shrink-0">
                      {r.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
