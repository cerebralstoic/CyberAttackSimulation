import express from "express";
import { completeLabController, startLab, stopLabController } from "../controllers/lab.controller.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/start",verifyFirebaseToken, startLab);
router.post("/stop",verifyFirebaseToken, stopLabController)
router.post("/complete",verifyFirebaseToken, completeLabController);

export default router;
