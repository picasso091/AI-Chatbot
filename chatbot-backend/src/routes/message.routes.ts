import { Router } from "express";

import { fetchUserMessages } from "../controllers/message.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", protect, fetchUserMessages);

export default router;
