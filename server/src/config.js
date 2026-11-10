import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const config = {
  port: parsePositiveInteger(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  sessionTtlHours: parsePositiveInteger(process.env.SESSION_TTL_HOURS, 8),
};

export const SESSION_COOKIE = "inventory_session";
