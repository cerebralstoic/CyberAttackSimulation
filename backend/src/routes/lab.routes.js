import express from "express";
import { startLab, stopLabController } from "../controllers/lab.controller.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/start",verifyFirebaseToken, startLab);
router.post("/stop",verifyFirebaseToken, stopLabController)

export default router;
