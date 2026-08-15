import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  pollOptions,
  seedAlerts,
  seedEvents,
  seedNotices,
  seedNotifications,
  seedProjects,
  seedReports,
  seedStars,
} from '@/data/sampleData';
import type {
  Alert,
  CommunityEvent,
  CommunityId,
  Notice,
  Notification as AppNotification,
  Project,
  Report,
  StarEntry,
} from '@/data/types';

export type ViewId =
  | 'home'
  | 'pulse'
  | 'reports'
  | 'development'
  | 'events'
  | 'notices'
  | 'calendar'
  | 'emergency'
  | 'impact'
  | 'star'
  | 'notifications'
  | 'about'
  | 'settings';

interface Settings {
  notifications: {
    reports: boolean;
    events: boolean;
    notices: boolean;
    polls: boolean;
    alerts: boolean;
  };
  theme: 'light' | 'dark';
  language: 'English' | 'Nepali' | 'Newari';
}

export interface WeeklyImpact {
  reportsSubmitted: number;
  usefulContributions: number;
  pollsParticipated: number;
  eventsAttended: number;
  programmesAttended: number;
  suggestionsSubmitted: number;
  communityScore: number;
  timeline: { day: string; action: string; icon: string }[];
  badges: { name: string; earned: boolean }[];
}

interface Store {
  // navigation
  view: ViewId;
  setView: (v: ViewId) => void;
  selectedCommunity: CommunityId;
  setSelectedCommunity: (c: CommunityId) => void;
  // data
  reports: Report[];
  addReport: (r: Omit<Report, 'id' | 'date' | 'upvotes'>) => void;
  upvoteReport: (id: string) => void;
  projects: Project[];
  events: CommunityEvent[];
  registerForEvent: (id: string) => void;
  notices: Notice[];
  alerts: Alert[];
  stars: StarEntry[];
  // poll
  pollVotes: Record<string, number>;
  pollVoted: string | null;
  votePoll: (optionId: string) => void;
  totalVotes: number;
  // notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  // weekly impact
  impact: WeeklyImpact;
  // settings
  settings: Settings;
  setSettings: (s: Settings) => void;
}

const StoreContext = createContext<Store | null>(null);

const defaultImpact: WeeklyImpact = {
  reportsSubmitted: 3,
  usefulContributions: 2,
  pollsParticipated: 1,
  eventsAttended: 2,
  programmesAttended: 1,
  suggestionsSubmitted: 2,
  communityScore: 86,
  timeline: [
    { day: 'Monday', action: 'Reported a streetlight problem in Shantipur', icon: 'lightbulb' },
    { day: 'Tuesday', action: 'Participated in the weekly poll on community priorities', icon: 'vote' },
    { day: 'Wednesday', action: 'Attended the digital literacy training session', icon: 'book' },
    { day: 'Thursday', action: 'Submitted a suggestion for the community garden project', icon: 'sparkles' },
    { day: 'Friday', action: 'Attended the monthly community meeting in Sundarghat', icon: 'users' },
  ],
  badges: [
    { name: 'First Report', earned: true },
    { name: 'Poll Participant', earned: true },
    { name: 'Event Attendee', earned: true },
    { name: 'Civic Champion', earned: false },
    { name: 'Five Reports', earned: false },
  ],
};

const defaultSettings: Settings = {
  notifications: { reports: true, events: true, notices: true, polls: true, alerts: true },
  theme: 'light',
  language: 'English',
};

let reportSeq = 1013;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>('home');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityId>('sundarghat');

  const [reports, setReports] = useLocalStorage<Report[]>('cp_reports', seedReports);
  const [projects] = useLocalStorage<Project[]>('cp_projects', seedProjects);
  const [events, setEvents] = useLocalStorage<CommunityEvent[]>('cp_events', seedEvents);
  const [notices] = useLocalStorage<Notice[]>('cp_notices', seedNotices);
  const [alerts] = useLocalStorage<Alert[]>('cp_alerts', seedAlerts);
  const [stars] = useLocalStorage<StarEntry[]>('cp_stars', seedStars);

  const [pollVotes, setPollVotes] = useLocalStorage<Record<string, number>>('cp_poll_votes', {
    road: 142,
    waste: 98,
    lighting: 76,
    parks: 54,
    digital: 67,
  });
  const [pollVoted, setPollVoted] = useLocalStorage<string | null>('cp_poll_voted', null);

  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>(
    'cp_notifications',
    seedNotifications,
  );

  const [impact, setImpact] = useLocalStorage<WeeklyImpact>('cp_impact', defaultImpact);
  const [settings, setSettings] = useLocalStorage<Settings>('cp_settings', defaultSettings);

  const addReport = useCallback(
    (r: Omit<Report, 'id' | 'date' | 'upvotes'>) => {
      const newReport: Report = {
        ...r,
        id: `r-${reportSeq++}`,
        date: new Date().toISOString().slice(0, 10),
        upvotes: 0,
      };
      setReports((prev) => [newReport, ...prev]);
      setImpact((prev) => ({
        ...prev,
        reportsSubmitted: prev.reportsSubmitted + 1,
        communityScore: Math.min(100, prev.communityScore + 2),
        timeline: [
          { day: 'Today', action: `Submitted a new report: ${r.title}`, icon: 'alert' },
          ...prev.timeline,
        ].slice(0, 7),
      }));
      setNotifications((prev) => [
        {
          id: `nf-${Date.now()}`,
          type: 'report',
          title: 'Report submitted',
          body: `Your report “${r.title}” has been published.`,
          date: new Date().toISOString().slice(0, 10),
          read: false,
        },
        ...prev,
      ]);
    },
    [setReports, setImpact, setNotifications],
  );

  const upvoteReport = useCallback(
    (id: string) => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)),
      );
    },
    [setReports],
  );

  const registerForEvent = useCallback(
    (id: string) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id && e.registered < e.capacity
            ? { ...e, registered: e.registered + 1 }
            : e,
        ),
      );
      setImpact((prev) => ({
        ...prev,
        eventsAttended: prev.eventsAttended + 1,
        communityScore: Math.min(100, prev.communityScore + 1),
      }));
      setNotifications((prev) => [
        {
          id: `nf-${Date.now()}`,
          type: 'event',
          title: 'Event reminder set',
          body: 'You will be reminded about this upcoming event.',
          date: new Date().toISOString().slice(0, 10),
          read: false,
        },
        ...prev,
      ]);
    },
    [setEvents, setImpact, setNotifications],
  );

  const votePoll = useCallback(
    (optionId: string) => {
      if (pollVoted) return;
      setPollVotes((prev) => ({ ...prev, [optionId]: (prev[optionId] ?? 0) + 1 }));
      setPollVoted(optionId);
      setImpact((prev) => ({
        ...prev,
        pollsParticipated: prev.pollsParticipated + 1,
        communityScore: Math.min(100, prev.communityScore + 1),
      }));
    },
    [pollVoted, setPollVotes, setPollVoted, setImpact],
  );

  const markNotificationRead = useCallback(
    (id: string) =>
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      ),
    [setNotifications],
  );

  const markAllNotificationsRead = useCallback(
    () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    [setNotifications],
  );

  const totalVotes = useMemo(
    () => Object.values(pollVotes).reduce((a, b) => a + b, 0),
    [pollVotes],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value: Store = {
    view,
    setView,
    selectedCommunity,
    setSelectedCommunity,
    reports,
    addReport,
    upvoteReport,
    projects,
    events,
    registerForEvent,
    notices,
    alerts,
    stars,
    pollVotes,
    pollVoted,
    votePoll,
    totalVotes,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
    impact,
    settings,
    setSettings,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
