import { useMemo, useState } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { communityById } from '@/data/sampleData';
import { formatDate, isUpcoming, relativeDate } from '@/utils/format';
import { Badge, Button, Card } from '@/components/ui';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView() {
  const { events, registerForEvent } = useStore();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof events> = {};
    events.forEach((e) => {
      (map[e.date] ??= []).push(e);
    });
    return map;
  }, [events]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] ?? [] : [];
  const upcomingAll = events.filter((e) => isUpcoming(e.date)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Community Calendar</h1>
        <p className="text-sm text-ink-400 mt-1">Select a date to see events and programmes scheduled that day.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 sm:gap-5">
        {/* calendar */}
        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-ink-800">{monthNames[viewMonth]} {viewYear}</h2>
            <div className="flex gap-1.5">
              <button onClick={prevMonth} className="w-9 h-9 rounded-lg border border-sand-200 hover:bg-sand-100 flex items-center justify-center text-ink-500" aria-label="Previous month">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelectedDate(todayStr); }} className="px-3 h-9 rounded-lg border border-sand-200 hover:bg-sand-100 text-xs font-semibold text-ink-500">
                Today
              </button>
              <button onClick={nextMonth} className="w-9 h-9 rounded-lg border border-sand-200 hover:bg-sand-100 flex items-center justify-center text-ink-500" aria-label="Next month">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-[11px] font-bold uppercase text-ink-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;
              const day = Number(date.slice(-2));
              const isToday = date === todayStr;
              const isSel = date === selectedDate;
              const hasEvents = eventsByDate[date]?.length > 0;
              const eventCount = eventsByDate[date]?.length ?? 0;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all relative ${
                    isSel ? 'bg-ink-700 text-white shadow-soft' : isToday ? 'bg-amber-100 text-ink-800' : 'hover:bg-sand-100 text-ink-600'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(eventCount, 3) }).map((_, j) => (
                        <span key={j} className={`w-1 h-1 rounded-full ${isSel ? 'bg-amber-300' : 'bg-amber-400'}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-sand-200 text-xs text-ink-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Has events</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100" /> Today</span>
          </div>
        </Card>

        {/* event details */}
        <Card className="lg:col-span-2 p-5">
          {selectedDate ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-1">{relativeDate(selectedDate)}</p>
              <h3 className="text-lg font-bold text-ink-800 mb-4">{formatDate(selectedDate)}</h3>
              {selectedEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedEvents.map((e) => (
                    <div key={e.id} className="p-3.5 rounded-xl border border-sand-200">
                      <p className="text-sm font-bold text-ink-800">{e.title}</p>
                      <p className="text-xs text-ink-400 mt-1 flex items-center gap-1"><Clock size={11} /> {e.time}</p>
                      <p className="text-xs text-ink-400 mt-0.5 flex items-center gap-1"><MapPin size={11} /> {communityById(e.community).name} • {e.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge tone="ink">{e.category}</Badge>
                        <span className="text-xs text-ink-400 flex items-center gap-1"><Users size={11} /> {e.registered}/{e.capacity}</span>
                      </div>
                      <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => registerForEvent(e.id)}>
                        Set reminder
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-sand-100 text-ink-300 flex items-center justify-center mx-auto mb-2">
                    <CalIcon size={22} />
                  </div>
                  <p className="text-sm font-semibold text-ink-600">No events</p>
                  <p className="text-xs text-ink-400 mt-0.5">No events scheduled on this date.</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-ink-800 mb-4">Upcoming Events</h3>
              <div className="space-y-2">
                {upcomingAll.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => { setSelectedDate(e.date); setViewYear(Number(e.date.slice(0, 4))); setViewMonth(Number(e.date.slice(5, 7)) - 1); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-sand-200 hover:border-ink-300 text-left transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-ink-50 text-ink-700 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold uppercase text-amber-600 leading-none">{new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-base font-extrabold leading-none mt-0.5">{new Date(e.date + 'T00:00:00').getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink-800 truncate">{e.title}</p>
                      <p className="text-xs text-ink-400">{e.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
