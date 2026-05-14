export interface ModuleCard {
  name: string;
  icon: string;
  difficulty_tier: number;
  accuracy_rate: number;
  puzzles_completed: number;
  total_puzzles: number;
  is_mastered: boolean;
  color: string;
}

export interface BadgeItem {
  name: string;
  icon: string;
  earned_at: string;
}

export interface ActivityItem {
  action: string;
  module: string;
  xp: number;
  time_ago: string;
  icon: string;
}

export interface WeeklyXP {
  day: string;
  xp: number;
}

export interface Stats {
  xp_points: number;
  streak_days: number;
  skill_level: string;
  accuracy_overall: number;
  puzzles_today: number;
  modules_mastered: number;
  total_modules: number;
  rank: number;
}

export interface DashboardData {
  user: { id: number; username: string; full_name: string; avatar: string; age: number };
  stats: Stats;
  modules: ModuleCard[];
  recent_activity: ActivityItem[];
  badges: BadgeItem[];
  weekly_xp: WeeklyXP[];
  ai_tip: string;
}

export interface ProfileData {
  id: number;
  username: string;
  email: string;
  full_name: string;
  age: number;
  avatar: string;
  skill_level: string;
  xp_points: number;
  streak_days: number;
  badges_count: number;
  modules_mastered: number;
  total_modules: number;
  member_since: string;
  available_avatars: string[];
}
