import express from "express";
import { startLab } from "../controllers/lab.controller.js";

const router = express.Router();

router.post("/start", startLab);

export default router;
