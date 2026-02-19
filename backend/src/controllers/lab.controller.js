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
import { createLabHistory } from "../services/userStat.service.js";

const LAB_STARTERS = {
  startSqlLab,
  startXssLab,
  startCmdiLab,
  startUploadLab,
};

export async function startLab(req, res) {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({
        error: "Lab type is required",
      });
    }
    const userId = req.user.uid;

    const lab = getLab(type);
    if(!lab){
      return res.status(404).json({ error: "Lab not found" });
    }

    const starterFn = LAB_STARTERS[lab.starter];
    if (!starterFn) {
      throw new Error("Lab starter not implemented");
    }

    const instance = await starterFn();

    await incrementUserStat(userId, "totalAttempts");
    scheduleTTL(instance.containerName, lab.ttl);
    console.log(`Lab ${lab.name} started for user ${userId}, container: ${instance.containerName}`);
    const historyId = await createLabHistory(userId, {
      labId: lab.id,
      name: lab.name,
      category: lab.category,
      difficulty: lab.difficulties[0],
      containerName: instance.containerName,
    });
    console.log(`Lab history entry created with ID: ${historyId} for user ${userId}`);
    res.json({
      lab: lab.id,
      containerName: instance.containerName,
      url: instance.url,
      ttl: lab.ttl,
      status: "running",
      historyId,
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
