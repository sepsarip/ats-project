import express from "express";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`ATS server listening on port ${env.port}`);
});