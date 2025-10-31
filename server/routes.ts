import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createMatchSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create new match session
  app.post("/api/match/create", async (req, res) => {
    try {
      const data = createMatchSessionSchema.parse(req.body);
      const session = await storage.createMatchSession(data);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  // Get match session
  app.get("/api/match/:id", async (req, res) => {
    const session = await storage.getMatchSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Match not found" });
    }
    res.json(session);
  });

  // Update match session
  app.patch("/api/match/:id", async (req, res) => {
    try {
      const session = await storage.updateMatchSession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Add timer event
  app.post("/api/match/:id/timer-event", async (req, res) => {
    try {
      const event = await storage.addTimerEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Failed to add timer event" });
    }
  });

  // Add score event
  app.post("/api/match/:id/score-event", async (req, res) => {
    try {
      const event = await storage.addScoreEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Failed to add score event" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
