export type CommunityId =
  | 'sundarghat'
  | 'shantipur'
  | 'pragati-tole'
  | 'sajha-nagar'
  | 'samunnati-nagar'
  | 'maitri-tole';

export interface Community {
  id: CommunityId;
  name: string;
  tagline: string;
  status: 'Good' | 'Stable' | 'Needs Attention';
  households: number;
  population: number;
  // map coordinates in a 0–100 viewBox space
  x: number;
  y: number;
  services: {
    wasteCollection: 'Normal' | 'Delayed' | 'Suspended';
    roadMaintenance: 'Normal' | 'In Progress' | 'Planned';
    streetlights: string;
    waterSupply: 'Normal' | 'Limited' | 'Interrupted';
  };
  developmentProgress: number;
}

export type ReportCategory =
  | 'Waste'
  | 'Roads'
  | 'Water'
  | 'Streetlights'
  | 'Traffic'
  | 'Public Safety'
  | 'Other';

export type ReportStatus = 'Reported' | 'In Progress' | 'Resolved';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Report {
  id: string;
  title: string;
  community: CommunityId;
  date: string; // ISO
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  priority: Priority;
  reporter: string;
  upvotes: number;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Near Completion' | 'Completed';

export interface Project {
  id: string;
  name: string;
  community: CommunityId;
  location: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  expectedCompletion: string;
  category: string;
  budget: string;
}

export type EventCategory =
  | 'Community Meeting'
  | 'Awareness Programme'
  | 'AI / Digital Training'
  | 'Education'
  | 'Health'
  | 'Community Activity';

export interface CommunityEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  community: CommunityId;
  location: string;
  description: string;
  category: EventCategory;
  capacity: number;
  registered: number;
}

export type NoticeCategory =
  | 'Health'
  | 'AI Training'
  | 'Digital Literacy'
  | 'Education'
  | 'Clean-up'
  | 'Announcement'
  | 'Safety';

export interface Notice {
  id: string;
  title: string;
  community: CommunityId | 'all';
  date: string;
  category: NoticeCategory;
  body: string;
  important: boolean;
}

export type AlertPriority = 'Urgent' | 'Important' | 'Information';

export interface Alert {
  id: string;
  title: string;
  message: string;
  priority: AlertPriority;
  community: CommunityId | 'all';
  date: string;
}

export interface StarEntry {
  rank: number;
  name: string;
  community: CommunityId;
  score: number;
  reports: number;
  verifiedReports: number;
  polls: number;
  events: number;
  suggestions: number;
  badge: string;
}

export interface PollOption {
  id: string;
  label: string;
}

export interface Notification {
  id: string;
  type: 'report' | 'event' | 'notice' | 'poll' | 'alert';
  title: string;
  body: string;
  date: string;
  read: boolean;
}
