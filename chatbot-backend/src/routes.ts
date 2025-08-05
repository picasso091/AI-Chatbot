import { Router } from "express";

import intentRoutes from "./routes/intent.routes";
import azureRoutes from "./routes/azure.routes";
import userRoutes from "./routes/user.routes";
import serviceRequestRoutes from "./routes/serviceRequest.routes";
import messageRoutes from "./routes/message.routes";

const router = Router();

router.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Chatbot API working"
    });
});

router.use("/api/v1/intent", intentRoutes);
router.use("/api/v1/azure", azureRoutes);
router.use("/api/v1/user", userRoutes);
router.use("/api/v1/serviceRequest", serviceRequestRoutes);
router.use("/api/v1/message", messageRoutes);

export default router;
