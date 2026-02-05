import express from "express";
import { startLab, stopLabController } from "../controllers/lab.controller.js";

const router = express.Router();

router.post("/start", startLab);
router.post("/stop", stopLabController)

export default router;
