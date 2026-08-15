import { useMemo, useState } from 'react';
import { Megaphone, Pin } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById, communities } from '@/data/sampleData';
import { formatDate } from '@/utils/format';
import { Badge, Card, EmptyState, SectionHeader } from '@/components/ui';
import type { NoticeCategory } from '@/data/types';

const categories: NoticeCategory[] = ['Health', 'AI Training', 'Digital Literacy', 'Education', 'Clean-up', 'Announcement', 'Safety'];

const catTone: Record<NoticeCategory, 'amber' | 'success' | 'ink' | 'neutral' | 'danger'> = {
  Health: 'danger',
  'AI Training': 'success',
  'Digital Literacy': 'success',
  Education: 'ink',
  'Clean-up': 'amber',
  Announcement: 'neutral',
  Safety: 'danger',
};

export function NoticesView() {
  const { notices } = useStore();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCommunity, setFilterCommunity] = useState('all');
  const [showImportantOnly, setShowImportantOnly] = useState(false);

  const filtered = useMemo(
    () =>
      notices.filter((n) => {
        if (filterCategory !== 'all' && n.category !== filterCategory) return false;
        if (filterCommunity !== 'all' && n.community !== filterCommunity && n.community !== 'all') return false;
        if (showImportantOnly && !n.important) return false;
        return true;
      }),
    [notices, filterCategory, filterCommunity, showImportantOnly],
  );

  const important = filtered.filter((n) => n.important);
  const regular = filtered.filter((n) => !n.important);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Community Notices</h1>
        <p className="text-sm text-ink-400 mt-1">Official notices and announcements from your community.</p>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-sand-200 text-sm font-semibold text-ink-700 outline-none">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterCommunity} onChange={(e) => setFilterCommunity(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-sand-200 text-sm font-semibold text-ink-700 outline-none">
          <option value="all">All communities</option>
          {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button
          onClick={() => setShowImportantOnly((s) => !s)}
          className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${showImportantOnly ? 'bg-amber-400 text-ink-900 border-amber-400' : 'bg-white text-ink-600 border-sand-200'}`}
        >
          Important only
        </button>
      </div>

      {filtered.length === 0 ? (
        <Card className="py-8"><EmptyState icon={<Megaphone size={26} />} title="No notices found" message="Try adjusting your filters." /></Card>
      ) : (
        <>
          {important.length > 0 && (
            <section>
              <SectionHeader title="Important Notices" icon={<Pin size={18} />} />
              <div className="space-y-3">
                {important.map((n) => (
                  <Card key={n.id} className="p-4 border-amber-200 bg-amber-50/40">
                    <NoticeCard n={n} />
                  </Card>
                ))}
              </div>
            </section>
          )}
          {regular.length > 0 && (
            <section>
              <SectionHeader title="All Notices" icon={<Megaphone size={18} />} />
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {regular.map((n) => (
                  <Card key={n.id} className="p-4">
                    <NoticeCard n={n} />
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function NoticeCard({ n }: { n: import('@/data/types').Notice }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <Badge tone={catTone[n.category]}>{n.category}</Badge>
        {n.important && <Badge tone="amber"><Pin size={10} /> Important</Badge>}
        <span className="text-xs text-ink-400 ml-auto">{formatDate(n.date)}</span>
      </div>
      <p className="text-sm font-bold text-ink-800 leading-snug mb-1.5">{n.title}</p>
      <p className="text-sm text-ink-500 leading-relaxed">{n.body}</p>
      <p className="text-xs text-ink-400 mt-2.5 font-medium">
        {n.community === 'all' ? 'All communities' : communityById(n.community).name}
      </p>
    </div>
  );
}
