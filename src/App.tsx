import { useState } from 'react';
import { StoreProvider, useStore, type ViewId } from '@/store/StoreContext';
import { Header } from '@/components/Header';
import { NavDrawer } from '@/components/NavDrawer';
import { HomeView } from '@/views/HomeView';
import { PulseView } from '@/views/PulseView';
import { ReportsView } from '@/views/ReportsView';
import { DevelopmentView } from '@/views/DevelopmentView';
import { EventsView } from '@/views/EventsView';
import { NoticesView } from '@/views/NoticesView';
import { CalendarView } from '@/views/CalendarView';
import { EmergencyView } from '@/views/EmergencyView';
import { ImpactView } from '@/views/ImpactView';
import { StarView } from '@/views/StarView';
import { NotificationsView } from '@/views/NotificationsView';
import { AboutView } from '@/views/AboutView';
import { SettingsView } from '@/views/SettingsView';
import { navItems } from '@/components/navItems';

function CurrentView() {
  const { view } = useStore();
  switch (view) {
    case 'home': return <HomeView />;
    case 'pulse': return <PulseView />;
    case 'reports': return <ReportsView />;
    case 'development': return <DevelopmentView />;
    case 'events': return <EventsView />;
    case 'notices': return <NoticesView />;
    case 'calendar': return <CalendarView />;
    case 'emergency': return <EmergencyView />;
    case 'impact': return <ImpactView />;
    case 'star': return <StarView />;
    case 'notifications': return <NotificationsView />;
    case 'about': return <AboutView />;
    case 'settings': return <SettingsView />;
    default: return <HomeView />;
  }
}

function Shell() {
  const { view, setView } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentItem = navItems.find((n) => n.id === view);

  return (
    <div className="min-h-screen bg-sand-50 text-ink-800 flex flex-col">
      <Header onOpenDrawer={() => setDrawerOpen(true)} />
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* desktop secondary nav bar */}
      <DesktopNavBar current={view} onNavigate={setView} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <CurrentView />
      </main>

      {/* mobile bottom nav */}
      <MobileBottomNav current={view} onNavigate={setView} />

      <footer className="hidden sm:block border-t border-sand-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-ink-400">
            CivicPulse • A prototype for a school technology competition. All data is fictional.
          </p>
          {currentItem && (
            <p className="text-xs text-ink-400 font-medium">{currentItem.label}</p>
          )}
        </div>
      </footer>
    </div>
  );
}

function DesktopNavBar({ current, onNavigate }: { current: string; onNavigate: (v: ViewId) => void }) {
  const mainItems = navItems.filter((n) => n.group === 'Main');
  return (
    <nav className="hidden lg:block sticky top-16 z-20 bg-sand-50/85 backdrop-blur-md border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 overflow-x-auto no-scrollbar h-12">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                active ? 'bg-ink-700 text-white' : 'text-ink-500 hover:bg-sand-100'
              }`}
            >
              <Icon size={15} className={active ? 'text-amber-300' : ''} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function MobileBottomNav({ current, onNavigate }: { current: string; onNavigate: (v: ViewId) => void }) {
  const items = navItems.filter((n) => ['home', 'reports', 'events', 'pulse', 'emergency'].includes(n.id));
  return (
    <nav className="lg:hidden sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-sand-200">
      <div className="flex items-center justify-around h-16 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${active ? 'text-ink-700' : 'text-ink-400'}`}
            >
              <Icon size={20} className={active ? 'text-ink-700' : ''} />
              <span className="text-[10px] font-semibold">{item.label.split(' ')[0]}</span>
              {active && <span className="w-1 h-1 rounded-full bg-amber-400 absolute -bottom-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
