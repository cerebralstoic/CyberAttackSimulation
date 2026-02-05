import {
  startSqlLab,
  startCmdiLab,
  startXssLab,
  startUploadLab,
} from "../services/docker.service.js";

import { getLab } from "../registry/getLab.js";
import { scheduleTTL } from "../services/ttl.service.js";

const LAB_STARTERS = {
  startSqlLab,
  startXssLab,
  startCmdiLab,
  startUploadLab,
};

export async function startLab(req, res) {
  try {
    const { type } = req.body;

    const lab = getLab(type);

    const starterFn = LAB_STARTERS[lab.starter];
    if (!starterFn) {
      throw new Error("Lab starter not implemented");
    }

    const instance = await starterFn();


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
