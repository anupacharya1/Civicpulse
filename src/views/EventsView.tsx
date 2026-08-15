import { useMemo, useState } from 'react';
import { Calendar, Check, Clock, MapPin, Users, X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById, communities } from '@/data/sampleData';
import { formatDate, isUpcoming, relativeDate } from '@/utils/format';
import { Badge, Button, Card, EmptyState, Modal, ProgressBar } from '@/components/ui';
import type { CommunityEvent, EventCategory } from '@/data/types';

const categoryTone: Record<EventCategory, 'amber' | 'ink' | 'success' | 'neutral'> = {
  'Community Meeting': 'ink',
  'Awareness Programme': 'amber',
  'AI / Digital Training': 'success',
  Education: 'neutral',
  Health: 'danger' as 'amber',
  'Community Activity': 'amber',
};

const categories: EventCategory[] = [
  'Community Meeting',
  'Awareness Programme',
  'AI / Digital Training',
  'Education',
  'Health',
  'Community Activity',
];

export function EventsView() {
  const { events, registerForEvent } = useStore();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCommunity, setFilterCommunity] = useState('all');
  const [tab, setTab] = useState<'upcoming' | 'all'>('upcoming');
  const [selected, setSelected] = useState<CommunityEvent | null>(null);
  const [registered, setRegistered] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let out = events.filter((e) => {
      if (tab === 'upcoming' && !isUpcoming(e.date)) return false;
      if (filterCategory !== 'all' && e.category !== filterCategory) return false;
      if (filterCommunity !== 'all' && e.community !== filterCommunity) return false;
      return true;
    });
    return [...out].sort((a, b) => a.date.localeCompare(b.date));
  }, [events, tab, filterCategory, filterCommunity]);

  const open = (e: CommunityEvent) => setSelected(e);
  const confirmRegister = () => {
    if (!selected) return;
    registerForEvent(selected.id);
    setRegistered((r) => [...r, selected.id]);
    setSelected({ ...selected, registered: selected.registered + 1 });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Events &amp; Programmes</h1>
        <p className="text-sm text-ink-400 mt-1">Community meetings, training, health camps, and activities.</p>
      </div>

      {/* tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('upcoming')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'upcoming' ? 'bg-ink-700 text-white' : 'bg-white border border-sand-200 text-ink-600'}`}>
          Upcoming
        </button>
        <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'all' ? 'bg-ink-700 text-white' : 'bg-white border border-sand-200 text-ink-600'}`}>
          All events
        </button>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-2">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-sand-200 text-sm font-semibold text-ink-700 outline-none">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterCommunity} onChange={(e) => setFilterCommunity(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-sand-200 text-sm font-semibold text-ink-700 outline-none">
          <option value="all">All communities</option>
          {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* events grid */}
      {filtered.length === 0 ? (
        <Card className="py-8"><EmptyState icon={<Calendar size={26} />} title="No events found" message="Try changing the filters or check back later." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((e) => {
            const isReg = registered.includes(e.id);
            const full = e.registered >= e.capacity;
            return (
              <Card key={e.id} hover onClick={() => open(e)} className="p-4 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-ink-700 text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase text-amber-300 leading-none">{new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-xl font-extrabold leading-none mt-1">{new Date(e.date + 'T00:00:00').getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Badge tone={categoryTone[e.category]}>{e.category}</Badge>
                    <p className="text-sm font-bold text-ink-800 leading-snug mt-1.5">{e.title}</p>
                  </div>
                </div>
                <p className="text-xs text-ink-500 line-clamp-2 flex-1">{e.description}</p>
                <div className="mt-3 pt-3 border-t border-sand-100 space-y-1.5">
                  <p className="text-xs text-ink-400 flex items-center gap-1.5"><Clock size={12} /> {e.time}</p>
                  <p className="text-xs text-ink-400 flex items-center gap-1.5"><MapPin size={12} /> {communityById(e.community).name}</p>
                  <p className="text-xs text-ink-400 flex items-center gap-1.5"><Users size={12} /> {e.registered}/{e.capacity} registered</p>
                </div>
                <div className="mt-2.5">
                  <ProgressBar value={(e.registered / e.capacity) * 100} tone={full ? 'amber' : 'ink'} />
                </div>
                {isReg && (
                  <p className="text-xs font-semibold text-success-600 flex items-center gap-1 mt-2"><Check size={13} /> You've registered</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Event Details" size="lg">
          <EventDetail event={selected} registered={registered.includes(selected.id)} full={selected.registered >= selected.capacity} onRegister={confirmRegister} />
        </Modal>
      )}
    </div>
  );
}

function EventDetail({ event, registered, full, onRegister }: { event: CommunityEvent; registered: boolean; full: boolean; onRegister: () => void }) {
  const community = communityById(event.community);
  return (
    <div className="space-y-4">
      <Badge tone={categoryTone[event.category]}>{event.category}</Badge>
      <div>
        <h3 className="text-lg font-bold text-ink-800 leading-tight">{event.title}</h3>
        <p className="text-sm text-ink-400 mt-1">{relativeDate(event.date)} • {formatDate(event.date)}</p>
      </div>
      <p className="text-sm text-ink-600 leading-relaxed">{event.description}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
          <p className="text-xs text-ink-400 flex items-center gap-1"><Clock size={12} /> Time</p>
          <p className="text-sm font-bold text-ink-800 mt-1">{event.time}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
          <p className="text-xs text-ink-400 flex items-center gap-1"><MapPin size={12} /> Location</p>
          <p className="text-sm font-bold text-ink-800 mt-1">{event.location}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 col-span-2">
          <p className="text-xs text-ink-400 flex items-center gap-1"><Users size={12} /> Registration</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-bold text-ink-800">{event.registered} / {event.capacity}</p>
            <span className="text-xs font-semibold text-ink-500">{community.name}</span>
          </div>
          <div className="mt-2"><ProgressBar value={(event.registered / event.capacity) * 100} tone={full ? 'amber' : 'ink'} /></div>
        </div>
      </div>

      {registered ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 border border-success-100 text-sm font-semibold text-success-700">
          <Check size={18} /> You've registered for this event.
        </div>
      ) : full ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 text-sm font-semibold text-amber-700">
          <X size={18} /> This event is at full capacity.
        </div>
      ) : (
        <Button variant="amber" onClick={onRegister} className="w-full flex items-center justify-center gap-1.5">
          <Check size={16} /> Register / Set Reminder
        </Button>
      )}
      <p className="text-xs text-ink-300">Prototype — registration is stored locally and adds to your weekly impact.</p>
    </div>
  );
}
