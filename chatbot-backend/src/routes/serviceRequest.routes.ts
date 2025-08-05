import { Router } from "express";

import { protect } from "../middleware/auth";
import { createServiceRequest } from "../controllers/serviceRequest.controller";

const router = Router();

router.post("/", protect, createServiceRequest);

export default router;
