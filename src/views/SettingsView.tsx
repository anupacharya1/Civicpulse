import { Bell, Globe, Info, Moon, Palette, Shield, Sun } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, SectionHeader } from '@/components/ui';

export function SettingsView() {
  const { settings, setSettings } = useStore();

  const toggleNotif = (key: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: !settings.notifications[key] },
    });
  };

  const notifItems: { key: keyof typeof settings.notifications; label: string; desc: string }[] = [
    { key: 'reports', label: 'Report updates', desc: 'When your reports receive updates' },
    { key: 'events', label: 'Event reminders', desc: 'Reminders for upcoming events' },
    { key: 'notices', label: 'New notices', desc: 'When new notices are posted' },
    { key: 'polls', label: 'Poll reminders', desc: 'Weekly poll reminders' },
    { key: 'alerts', label: 'Community alerts', desc: 'Urgent and important alerts' },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Settings</h1>
        <p className="text-sm text-ink-400 mt-1">Manage your preferences.</p>
      </div>

      {/* notifications */}
      <Card className="p-5">
        <SectionHeader title="Notification Preferences" icon={<Bell size={18} />} />
        <div className="divide-y divide-sand-100">
          {notifItems.map((n) => (
            <div key={n.key} className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm font-semibold text-ink-800">{n.label}</p>
                <p className="text-xs text-ink-400 mt-0.5">{n.desc}</p>
              </div>
              <Toggle on={settings.notifications[n.key]} onToggle={() => toggleNotif(n.key)} />
            </div>
          ))}
        </div>
      </Card>

      {/* theme */}
      <Card className="p-5">
        <SectionHeader title="Theme" icon={<Palette size={18} />} />
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSettings({ ...settings, theme: 'light' })}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${settings.theme === 'light' ? 'bg-ink-700 text-white border-ink-700' : 'bg-sand-50 text-ink-600 border-sand-200'}`}
          >
            <Sun size={18} />
            <span className="text-sm font-semibold">Light</span>
          </button>
          <button
            onClick={() => setSettings({ ...settings, theme: 'dark' })}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${settings.theme === 'dark' ? 'bg-ink-700 text-white border-ink-700' : 'bg-sand-50 text-ink-600 border-sand-200'}`}
          >
            <Moon size={18} />
            <span className="text-sm font-semibold">Dark</span>
          </button>
        </div>
        <p className="text-xs text-ink-400 mt-2">Dark theme is a preview preference and may not apply to all sections.</p>
      </Card>

      {/* language */}
      <Card className="p-5">
        <SectionHeader title="Language" icon={<Globe size={18} />} />
        <div className="grid grid-cols-3 gap-3">
          {(['English', 'Nepali', 'Newari'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSettings({ ...settings, language: lang })}
              className={`p-3.5 rounded-xl border text-sm font-semibold transition-colors ${settings.language === lang ? 'bg-ink-700 text-white border-ink-700' : 'bg-sand-50 text-ink-600 border-sand-200'}`}
            >
              {lang}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-400 mt-2">Language selection is saved as a preference. Full translations are a future possibility.</p>
      </Card>

      {/* privacy */}
      <Card className="p-5">
        <SectionHeader title="Privacy" icon={<Shield size={18} />} />
        <div className="space-y-3 text-sm text-ink-600 leading-relaxed">
          <p>CivicPulse stores your activity locally in your browser using localStorage. This includes:</p>
          <ul className="space-y-1.5 ml-2">
            <li className="flex gap-2"><span className="text-amber-500">•</span> Reports you submit</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Your weekly poll vote</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Event registrations and reminders</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Notification and app preferences</li>
          </ul>
          <p>No personal data is sent to any server. This is a frontend prototype and does not collect or transmit personal information.</p>
        </div>
      </Card>

      {/* about link */}
      <Card className="p-5">
        <SectionHeader title="About" icon={<Info size={18} />} />
        <p className="text-sm text-ink-600 leading-relaxed">
          CivicPulse is a prototype created for a school technology competition. It is not an official government platform. All data shown is fictional sample data for demonstration.
        </p>
      </Card>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-amber-400' : 'bg-sand-300'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${on ? 'translate-x-5' : ''}`} />
    </button>
  );
}
