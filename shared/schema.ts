import { z } from "zod";

// Pre-Match Information Schema
export const preMatchFormSchema = z.object({
  // Match Officials
  refereeName: z.string().min(1, "Referee name is required").max(50),
  assistantReferee1: z.string().min(1, "Assistant Referee 1 is required").max(50),
  assistantReferee2: z.string().min(1, "Assistant Referee 2 is required").max(50),
  fourthOfficial: z.string().max(50).optional(),
  
  // Match Information
  matchDate: z.string().min(1, "Match date is required"),
  kickoffTime: z.string().min(1, "Kickoff time is required"),
  venue: z.string().min(1, "Venue is required").max(100),
  competition: z.string().min(1, "Competition is required").max(100),
  matchNumber: z.string().max(50).optional(),
  
  // Team Information
  homeTeam: z.string().min(1, "Home team is required").max(50),
  awayTeam: z.string().min(1, "Away team is required").max(50),
  
  // Additional Notes
  preMatchNotes: z.string().max(500).optional(),
});

export type PreMatchForm = z.infer<typeof preMatchFormSchema>;

// Timer Event Types
export type TimerEventType = 
  | "match_start"
  | "first_half_start"
  | "timer_pause"
  | "timer_resume"
  | "first_half_end"
  | "stoppage_time_end"
  | "halftime_start"
  | "second_half_start"
  | "second_half_end"
  | "match_complete";

export interface TimerEvent {
  id: string;
  eventType: TimerEventType;
  matchTime: number; // in seconds
  timestamp: string; // ISO timestamp
  duration?: number; // for pause events, duration in seconds
  notes?: string;
}

// Score Event
export interface ScoreEvent {
  id: string;
  team: "home" | "away";
  matchTime: number; // in seconds
  timestamp: string;
  homeScore: number;
  awayScore: number;
}

// Match State
export type MatchPhase = "pre_match" | "countdown_first" | "first_half" | "halftime" | "countdown_second" | "second_half" | "complete";

export type TimerState = "idle" | "countdown" | "running" | "paused" | "stoppage" | "halftime" | "complete";

export interface MatchSession {
  id: string;
  preMatchData: PreMatchForm;
  
  // Match timing
  currentPhase: MatchPhase;
  timerState: TimerState;
  elapsedTime: number; // total elapsed time in seconds
  currentHalfStartTime?: string; // ISO timestamp when current half started
  pauseStartTime?: string; // ISO timestamp when pause started
  
  // Stoppage time tracking
  firstHalfStoppageTime: number; // in seconds
  secondHalfStoppageTime: number; // in seconds
  currentStoppageTime: number; // accumulated stoppage for current half
  
  // Scores
  homeScore: number;
  awayScore: number;
  
  // Event logs
  timerEvents: TimerEvent[];
  scoreEvents: ScoreEvent[];
  
  // Post-match
  postMatchNotes?: string;
  completedAt?: string;
}

// Insert schema for creating new match session
export const createMatchSessionSchema = z.object({
  preMatchData: preMatchFormSchema,
});

export type CreateMatchSession = z.infer<typeof createMatchSessionSchema>;

// Export for CSV
export interface MatchReportData {
  session: MatchSession;
  reportGeneratedAt: string;
}
