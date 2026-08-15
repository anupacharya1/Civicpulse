import { X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { navItems } from '@/components/navItems';
import { communities } from '@/data/sampleData';

export function NavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { view, setView, selectedCommunity, setSelectedCommunity, unreadCount } = useStore();

  const go = (id: typeof view) => {
    setView(id);
    onClose();
  };

  const groups = ['Main', 'Personal', 'About'];

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[300px] max-w-[85vw] bg-sand-50 shadow-soft-xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* header */}
        <div className="px-5 py-4 bg-ink-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                <path d="M12 30c4-3 8-3 12 0s8 3 12 0" stroke="#df9d36" strokeWidth="3" strokeLinecap="round" />
                <circle cx="24" cy="20" r="5" fill="#df9d36" />
                <path d="M24 15v-3M31 20h3M17 20h-3M28.5 15.5l2-2M19.5 15.5l-2-2" stroke="#df9d36" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-lg">CivicPulse</p>
              <p className="text-xs text-ink-200">Prototype • School Competition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* community selector */}
        <div className="px-4 py-3 border-b border-sand-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-2 px-1">
            Your Community
          </p>
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value as typeof selectedCommunity)}
            className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-700 focus:border-ink-400 outline-none"
          >
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {groups.map((group) => (
            <div key={group} className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-1.5 px-2">
                {group}
              </p>
              <div className="space-y-0.5">
                {navItems
                  .filter((n) => n.group === group)
                  .map((item) => {
                    const Icon = item.icon;
                    const active = view === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => go(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          active
                            ? 'bg-ink-700 text-white shadow-soft'
                            : 'text-ink-600 hover:bg-sand-100'
                        }`}
                      >
                        <Icon size={18} className={active ? 'text-amber-300' : 'text-ink-400'} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.id === 'notifications' && unreadCount > 0 && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-ink-900 text-[10px] font-bold flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-5 py-3 border-t border-sand-200 text-[11px] text-ink-400 text-center">
          CivicPulse is a prototype for a school technology competition.
        </div>
      </aside>
    </>
  );
}
