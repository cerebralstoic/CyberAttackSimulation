import express from "express";
import { startSqlLab, stopLab, startXssLab } from "../services/docker.service.js";

const router = express.Router();

router.post("/start/sqli", async (req, res) => {
  try {
    const lab = await startSqlLab();
    res.json(lab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start SQLi lab" });
  }
});


router.post("/start/xss", async (req, res) => {
  try {
    const lab = await startXssLab();
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

router.post("/stop", async (req, res) => {
  const { containerName } = req.body;

  try {
    await stopLab(containerName);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to stop lab" });
  }
});

export default router;
