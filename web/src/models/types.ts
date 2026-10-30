export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  region: string;
  rating: number;
  winRate: string;
  favoriteGame: string;
  tier: string;
  trend: "UP" | "DOWN" | "STABLE";
}
