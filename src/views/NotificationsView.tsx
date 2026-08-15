import { Bell, BellOff, CheckCheck, FileWarning, Calendar, Megaphone, Vote, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatDate } from '@/utils/format';
import { Button, Card, EmptyState } from '@/components/ui';
import type { Notification as AppNotification } from '@/data/types';

const typeConfig: Record<AppNotification['type'], { icon: typeof Bell; tone: string; label: string }> = {
  report: { icon: FileWarning, tone: 'text-danger-500 bg-danger-50', label: 'Report' },
  event: { icon: Calendar, tone: 'text-amber-600 bg-amber-50', label: 'Event' },
  notice: { icon: Megaphone, tone: 'text-success-700 bg-success-50', label: 'Notice' },
  poll: { icon: Vote, tone: 'text-ink-500 bg-ink-100', label: 'Poll' },
  alert: { icon: AlertTriangle, tone: 'text-danger-500 bg-danger-50', label: 'Alert' },
};

export function NotificationsView() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useStore();

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Notifications</h1>
          <p className="text-sm text-ink-400 mt-1">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllNotificationsRead} className="flex items-center gap-1.5">
            <CheckCheck size={16} /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="py-8"><EmptyState icon={<BellOff size={26} />} title="No notifications" message="You're all caught up." /></Card>
      ) : (
        <Card className="divide-y divide-sand-100">
          {notifications.map((n) => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            return (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-sand-50 ${!n.read ? 'bg-amber-50/30' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.tone}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-ink-800 truncate">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                  </div>
                  <p className="text-sm text-ink-500 leading-snug">{n.body}</p>
                  <p className="text-xs text-ink-400 mt-1">{formatDate(n.date)} • {cfg.label}</p>
                </div>
              </button>
            );
          })}
        </Card>
      )}
    </div>
  );
}
