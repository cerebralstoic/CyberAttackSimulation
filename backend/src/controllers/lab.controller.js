import {
  startSqlLab,
  startCmdiLab,
  startXssLab,
  startUploadLab,
} from "../services/docker.service.js";
import { stopLab } from "../services/docker.service.js";
import { cancelTTL } from "../services/ttl.service.js";
import { getLab } from "../registry/getLab.js";
import { scheduleTTL } from "../services/ttl.service.js";
import { incrementUserStat } from "../services/userStat.service.js";


const LAB_STARTERS = {
  startSqlLab,
  startXssLab,
  startCmdiLab,
  startUploadLab,
};

export async function startLab(req, res) {
  try {
    const { type } = req.body;
    const userId = req.user.uid;

    const lab = getLab(type);

    const starterFn = LAB_STARTERS[lab.starter];
    if (!starterFn) {
      throw new Error("Lab starter not implemented");
    }

    const instance = await starterFn();

    await incrementUserStat(userId, "totalAttempts");
    scheduleTTL(instance.containerName, lab.ttl);

    res.json({
      lab: lab.id,
      containerName: instance.containerName,
      url: instance.url,
      ttl: lab.ttl,
      status: "running",
    });
  } catch (err) {
    console.error("START LAB ERROR:", err.message);
    res.status(400).json({ error: err.message });
  }
}



export async function stopLabController(req, res) {
  try {
    const { containerName } = req.body;

    if (!containerName) {
      return res.status(400).json({ error: "containerName required" });
    }

    cancelTTL(containerName);
    await stopLab(containerName);

    res.json({
      containerName,
      status: "stopped",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
