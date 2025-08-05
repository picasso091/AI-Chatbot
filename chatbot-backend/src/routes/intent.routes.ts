import { Router } from "express";

import { actWithIntent } from "../controllers/intent.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/", protect, actWithIntent);

export default router;
