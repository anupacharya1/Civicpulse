import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  Home,
  Map,
  Settings,
  Sparkles,
  Siren,
  TrendingUp,
  Trophy,
  Info,
  Megaphone,
  Wrench,
  FileWarning,
} from 'lucide-react';
import type { ViewId } from '@/store/StoreContext';

export const navItems: {
  id: ViewId;
  label: string;
  icon: typeof Home;
  group: string;
}[] = [
  { id: 'home', label: 'Home', icon: Home, group: 'Main' },
  { id: 'pulse', label: 'Community Pulse', icon: Activity, group: 'Main' },
  { id: 'reports', label: 'Community Reports', icon: FileWarning, group: 'Main' },
  { id: 'development', label: 'Development Works', icon: Wrench, group: 'Main' },
  { id: 'events', label: 'Events & Programmes', icon: Calendar, group: 'Main' },
  { id: 'notices', label: 'Community Notices', icon: Megaphone, group: 'Main' },
  { id: 'calendar', label: 'Community Calendar', icon: Calendar, group: 'Main' },
  { id: 'emergency', label: 'Emergency', icon: Siren, group: 'Main' },
  { id: 'impact', label: 'My Weekly Impact', icon: TrendingUp, group: 'Personal' },
  { id: 'star', label: 'Community Star', icon: Trophy, group: 'Personal' },
  { id: 'notifications', label: 'Notifications', icon: Bell, group: 'Personal' },
  { id: 'about', label: 'About CivicPulse', icon: Info, group: 'About' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'About' },
];

export const iconMap: Record<string, typeof Home> = {
  lightbulb: Sparkles,
  vote: Activity,
  book: Calendar,
  sparkles: Sparkles,
  users: Home,
  alert: AlertTriangle,
};

export { Map, Trophy, TrendingUp };
