import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  clearCookieOptions,
  cookieOptions,
  createAuth,
  requireRole,
  SESSION_COOKIE,
} from "./auth.js";
import { createBorrowService } from "./borrowService.js";
import { AppError } from "./errors.js";

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
});
const itemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(500),
  totalQuantity: z.number().int().min(1).max(10000),
});
const requestSchema = z.object({
  itemId: z.uuid(),
  quantity: z.number().int().min(1).max(1000),
  purpose: z.string().trim().min(3).max(500),
});
const rejectionSchema = z.object({ reason: z.string().trim().min(3).max(500) });

const parse = (schema, body) => {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join("; ");
    throw new AppError(400, "VALIDATION_ERROR", message);
  }
  return result.data;
};

export const createApp = (db) => {
  const app = express();
  const auth = createAuth(db);
  const borrowService = createBorrowService(db);

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/ready", async (_req, res) => {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: "ready", db: "connected" });
  });

  app.post("/api/auth/login", async (req, res) => {
    const input = parse(loginSchema, req.body);
    const result = await auth.login(input.email, input.password);
    res.cookie(SESSION_COOKIE, result.token, cookieOptions(result.expiresAt));
    res.json({ user: result.user });
  });
  app.post("/api/auth/logout", async (req, res) => {
    await auth.logout(req.cookies[SESSION_COOKIE]);
    res.clearCookie(SESSION_COOKIE, clearCookieOptions);
    res.status(204).end();
  });

  const authenticated = async (req, _res, next) => {
    try {
      req.user = await auth.authenticate(req.cookies[SESSION_COOKIE]);
      next();
    } catch (error) {
      next(error);
    }
  };

  app.get("/api/auth/me", authenticated, (req, res) => res.json({ user: req.user }));

  app.get("/api/items", authenticated, async (_req, res) => {
    const items = await db.item.findMany({ where: { active: true }, orderBy: { name: "asc" } });
    res.json({ items });
  });
  app.post("/api/items", authenticated, requireRole("CUSTODIAN"), async (req, res) => {
    const input = parse(itemSchema, req.body);
    const item = await db.item.create({
      data: { ...input, availableQuantity: input.totalQuantity },
    });
    res.status(201).json({ item });
  });

  app.get("/api/borrow-requests", authenticated, async (req, res) => {
    const requests = await borrowService.listForUser(req.user);
    res.json({ requests });
  });
  app.post(
    "/api/borrow-requests",
    authenticated,
    requireRole("BORROWER"),
    async (req, res) => {
      const request = await borrowService.create(req.user, parse(requestSchema, req.body));
      res.status(201).json({ request });
    },
  );
  app.post(
    "/api/borrow-requests/:id/approve",
    authenticated,
    requireRole("CUSTODIAN"),
    async (req, res) => {
      const request = await borrowService.approve(req.user, req.params.id);
      res.json({ request });
    },
  );
  app.post(
    "/api/borrow-requests/:id/reject",
    authenticated,
    requireRole("CUSTODIAN"),
    async (req, res) => {
      const input = parse(rejectionSchema, req.body);
      const request = await borrowService.reject(req.user, req.params.id, input.reason);
      res.json({ request });
    },
  );
  app.post(
    "/api/borrow-requests/:id/return",
    authenticated,
    requireRole("BORROWER"),
    async (req, res) => {
      const request = await borrowService.returnItem(req.user, req.params.id);
      res.json({ request });
    },
  );

  const publicDir = fileURLToPath(new URL("../public", import.meta.url));
  const indexFile = path.join(publicDir, "index.html");
  if (existsSync(indexFile)) {
    app.use(express.static(publicDir));
    app.use((req, res, next) => {
      if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
      res.sendFile(indexFile);
    });
  }

  app.use((req, res) => res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found." } }));
  app.use((error, _req, res, _next) => {
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: { code: error.code, message: error.message } });
    }
    console.error(error);
    return res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
    });
  });

  return app;
};
