import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log('[DEBUG] Starting server bootstrap...');
    // Health check endpoint
    app.get('/api/health', (_req, res) => {
      res.json({ ok: true });
    });

    // Database connection check endpoint
    app.get('/api/debug/db', async (req, res) => {
      try {
        const { storage } = await import('./storage');
        const { users } = await import('../shared/schema');
        const { eq } = await import('drizzle-orm');
        // Query user count
        const usersResult = await storage.db.select().from(users);
        res.json({ connected: true, userCount: usersResult.length });
      } catch (err) {
        let errorMsg = 'Unknown error';
        if (err instanceof Error) errorMsg = err.message;
        res.status(500).json({ connected: false, error: errorMsg });
      }
    });

    // DEBUG ENDPOINT: Check agent status (register before any static/frontend middleware)
    app.get('/api/debug/agents', async (req, res) => {
      try {
        const { storage } = await import('./storage');
        const { users } = await import('../shared/schema');
        const { eq } = await import('drizzle-orm');
        // Query agents using drizzle ORM
        const agents = await storage.db.select().from(users).where(eq(users.role, 'agent'));
        res.json({ connected: true, agentCount: agents.length, agents });
      } catch (err) {
        let errorMsg = 'Unknown error';
        if (err instanceof Error) errorMsg = err.message;
        res.status(500).json({ connected: false, error: errorMsg });
      }
    });

    // Endpoint to verify all agents (for testing/demo purposes)
    app.post('/api/debug/verify-all-agents', async (req, res) => {
      try {
        const { storage } = await import('./storage');
        const { users } = await import('../shared/schema');
        const { eq } = await import('drizzle-orm');
        // Get all agents
        const agents = await storage.db.select().from(users).where(eq(users.role, 'agent'));
        // Update status to 'verified' for each agent
        for (const agent of agents) {
          await storage.db.update(users).set({ status: 'verified' }).where(eq(users.id, agent.id));
        }
        res.json({ success: true, verifiedCount: agents.length });
      } catch (err) {
        let errorMsg = 'Unknown error';
        if (err instanceof Error) errorMsg = err.message;
        res.status(500).json({ success: false, error: errorMsg });
      }
    });
    // Endpoint to verify all users (for testing/demo purposes)
    app.post('/api/debug/verify-all-users', async (req, res) => {
      try {
        const { storage } = await import('./storage');
        const { users } = await import('../shared/schema');
        const { eq } = await import('drizzle-orm');
        // Get all users
        const allUsers = await storage.db.select().from(users);
        // Update status to 'verified' for each user
        for (const user of allUsers) {
          await storage.db.update(users).set({ status: 'verified' }).where(eq(users.id, user.id));
        }
        res.json({ success: true, verifiedCount: allUsers.length });
      } catch (err) {
        let errorMsg = 'Unknown error';
        if (err instanceof Error) errorMsg = err.message;
        res.status(500).json({ success: false, error: errorMsg });
      }
    });
    const server = await registerRoutes(app);
    console.log('[DEBUG] Routes registered.');
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      console.log('[DEBUG] Setting up Vite for development...');
      await setupVite(app, server);
      console.log('[DEBUG] Vite setup complete.');
    } else {
      serveStatic(app);
      console.log('[DEBUG] Serving static files.');
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 2333;
    console.log(`[DEBUG] About to listen on 127.0.0.1:${port}`);
    server.listen({
      port,
      host: "127.0.0.1",
    }, () => {
      log(`serving on port ${port}`);
      console.log('[DEBUG] Server is now listening.');
    });
  } catch (err) {
    console.error('[FATAL] Server failed to start:', err);
    process.exit(1);
  }
})();
