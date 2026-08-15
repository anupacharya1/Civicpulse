import { Bell, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/StoreContext';
import { SearchOverlay } from '@/components/SearchOverlay';

export function Header({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const { setView, unreadCount } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-sand-50/85 backdrop-blur-md border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-ink-700 flex items-center justify-center shadow-soft">
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                <path
                  d="M12 30c4-3 8-3 12 0s8 3 12 0"
                  stroke="#df9d36"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="20" r="5" fill="#df9d36" />
                <path
                  d="M24 15v-3M31 20h3M17 20h-3M28.5 15.5l2-2M19.5 15.5l-2-2"
                  stroke="#df9d36"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="hidden sm:block text-left leading-none">
              <span className="block font-extrabold text-ink-800 text-lg tracking-tight">
                CivicPulse
              </span>
              <span className="block text-[11px] text-ink-400 font-medium mt-0.5">
                Community Pulse, Simplified
              </span>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-10 pl-3 pr-3 sm:pr-4 rounded-full bg-white border border-sand-200 hover:border-ink-300 text-ink-400 hover:text-ink-600 transition-colors shadow-soft"
              aria-label="Search"
            >
              <Search size={18} />
              <span className="hidden md:block text-sm font-medium">Search community…</span>
              <kbd className="hidden md:block text-[10px] font-semibold bg-sand-100 text-ink-400 px-1.5 py-0.5 rounded">
                /
              </kbd>
            </button>

            <button
              onClick={() => setView('notifications')}
              className="relative w-10 h-10 rounded-full bg-white border border-sand-200 hover:border-ink-300 flex items-center justify-center text-ink-500 transition-colors shadow-soft"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-ink-900 text-[10px] font-bold flex items-center justify-center border-2 border-sand-50">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenDrawer}
              className="w-10 h-10 rounded-full bg-ink-700 text-white hover:bg-ink-800 flex items-center justify-center transition-colors shadow-soft"
              aria-label="Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
