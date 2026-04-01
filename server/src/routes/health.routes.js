import { Router } from "express";
import { getAiHealth, getApiHealth } from "../controllers/health.controller.js";

const router = Router();

router.get("/health", getApiHealth);
router.get("/health/ai", getAiHealth);

export default router;