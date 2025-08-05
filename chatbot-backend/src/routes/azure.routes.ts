import { Router } from "express";

import { getSpeechToken } from "../controllers/azure.controller";

const router = Router();

router.get("/speech-token", getSpeechToken);

export default router;
