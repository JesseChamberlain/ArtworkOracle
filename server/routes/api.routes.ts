import { Router } from "express";
import * as insightController from "../controllers/insight.controller";

const router = Router();

/**
 * @route GET /api/artwork/random
 * @description Get a random artwork with gene, artist, and AI insights
 */
router.get("/insight/random", insightController.getRandomInsight);

export default router;
