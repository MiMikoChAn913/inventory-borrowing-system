import { createApp } from "./app.js";
import { config } from "./config.js";
import { prisma } from "./db.js";

const app = createApp(prisma);
const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`Inventory server listening on port ${config.port}`);
});

const shutdown = async (signal) => {
  console.log(`Received ${signal}; shutting down.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
