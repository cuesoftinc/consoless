export enum ConsoleType {
  RETRO = "RETRO",
  MODERN = "MODERN",
  PC = "PC",
}

export enum PerformanceTier {
  STANDARD = "Standard",
  PRO = "Pro",
  ULTRA = "Ultra",
}

export interface Game {
  id: string;
  title: string;
  genre: string;
  coverUrl: string;
  releaseYear: number;
  rating: number;
  description: string;
}

export interface ConsoleModel {
  id: string;
  name: string;
  type: ConsoleType;
  tier: PerformanceTier;
  hourlyRate: number;
  specs: string;
  imageUrl: string;
  supportedGames: string[]; // Game IDs
}

export interface Session {
  id: string;
  consoleId: string;
  gameId: string;
  startTime: number;
  isPartyMode: boolean;
  chatLog: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface LinkedAccount {
  id: string;
  provider: string;
  username?: string;
  connected: boolean;
  color: string; // Tailwind class for branding
}

export interface AIAssistanceResponse {
  tip: string;
  strategy: string;
  relevantStats: { label: string; value: string }[];
}

export enum TournamentStatus {
  REGISTRATION = "Registration",
  LIVE = "Live",
  COMPLETED = "Completed",
}

export interface Tournament {
  id: string;
  title: string;
  gameId: string;
  format: "1v1" | "2v2 Tag Team" | "Squad" | "Battle Royale";
  participants: number;
  maxParticipants: number;
  prizePool: string;
  status: TournamentStatus;
  region: "Global" | "NA" | "EU" | "ASIA";
  startTime: string;
  imageUrl: string;
}

export interface Transaction {
  id: string;
  type: "DEPOSIT" | "PURCHASE" | "REFUND" | "PRIZE";
  amount: number;
  method: "CRYPTO" | "CREDIT_CARD" | "STORE_CREDIT";
  date: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  description: string;
}

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
