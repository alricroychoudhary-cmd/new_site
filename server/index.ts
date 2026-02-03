import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import path from "path";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Request logging middleware
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
      log(logLine);
    }
  });

  next();
});

// Async initialization function
let initPromise: Promise<void> | null = null;
async function initialize() {
  await registerRoutes(httpServer, app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });

  // Serve frontend in production or Vite in dev
  if (process.env.NODE_ENV === "production") {
    // Explicit static serving (replace serveStatic if it's not working)
    app.use(express.static(path.join(__dirname, "../public")));

    // Catch-all route for SPA (must be last)
    app.get("*", (req, res) => {
      const indexPath = path.join(__dirname, "../public/index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          res.status(500).send("Server error");
        }
      });
    });
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }
}

// Lazy init
function getInitPromise() {
  if (!initPromise) {
    initPromise = initialize();
  }
  return initPromise;
}

// Vercel handler (async to await init)
const handler = async (req: Request, res: Response) => {
  try {
    await getInitPromise();
    app(req, res);
  } catch (err) {
    console.error("Initialization error:", err);
    res.status(500).send("Server initialization failed");
  }
};

// Export the handler for Vercel
export default handler;

// Local server start (non-Vercel)
if (!process.env.VERCEL) {
  getInitPromise().then(() => {
    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`Server listening on port ${port}`);
      }
    );
  }).catch(err => {
    console.error("Local init error:", err);
    process.exit(1);
  });
}
