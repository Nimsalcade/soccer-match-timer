import type { MatchSession, CreateMatchSession, TimerEvent, ScoreEvent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Match Session Management
  createMatchSession(data: CreateMatchSession): Promise<MatchSession>;
  getMatchSession(id: string): Promise<MatchSession | undefined>;
  updateMatchSession(id: string, session: Partial<MatchSession>): Promise<MatchSession | undefined>;
  
  // Timer Events
  addTimerEvent(matchId: string, event: Omit<TimerEvent, "id">): Promise<TimerEvent>;
  
  // Score Events
  addScoreEvent(matchId: string, event: Omit<ScoreEvent, "id">): Promise<ScoreEvent>;
}

export class MemStorage implements IStorage {
  private matchSessions: Map<string, MatchSession>;

  constructor() {
    this.matchSessions = new Map();
  }

  async createMatchSession(data: CreateMatchSession): Promise<MatchSession> {
    const id = randomUUID();
    const session: MatchSession = {
      id,
      preMatchData: data.preMatchData,
      currentPhase: "pre_match",
      timerState: "idle",
      elapsedTime: 0,
      firstHalfStoppageTime: 0,
      secondHalfStoppageTime: 0,
      currentStoppageTime: 0,
      homeScore: 0,
      awayScore: 0,
      timerEvents: [],
      scoreEvents: [],
    };
    
    this.matchSessions.set(id, session);
    return session;
  }

  async getMatchSession(id: string): Promise<MatchSession | undefined> {
    return this.matchSessions.get(id);
  }

  async updateMatchSession(id: string, updates: Partial<MatchSession>): Promise<MatchSession | undefined> {
    const session = this.matchSessions.get(id);
    if (!session) return undefined;
    
    const updated = { ...session, ...updates };
    this.matchSessions.set(id, updated);
    return updated;
  }

  async addTimerEvent(matchId: string, event: Omit<TimerEvent, "id">): Promise<TimerEvent> {
    const session = this.matchSessions.get(matchId);
    if (!session) throw new Error("Match session not found");
    
    const timerEvent: TimerEvent = {
      ...event,
      id: randomUUID(),
    };
    
    session.timerEvents.push(timerEvent);
    this.matchSessions.set(matchId, session);
    
    return timerEvent;
  }

  async addScoreEvent(matchId: string, event: Omit<ScoreEvent, "id">): Promise<ScoreEvent> {
    const session = this.matchSessions.get(matchId);
    if (!session) throw new Error("Match session not found");
    
    const scoreEvent: ScoreEvent = {
      ...event,
      id: randomUUID(),
    };
    
    session.scoreEvents.push(scoreEvent);
    this.matchSessions.set(matchId, session);
    
    return scoreEvent;
  }
}

export const storage = new MemStorage();
