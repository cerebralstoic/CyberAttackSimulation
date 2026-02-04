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
      return res.status(500).json({
        error: "Lab starter not implemented",
      });
    }

    const instance = await starterFn();

    scheduleTTL(instance.containerName, lab.ttl);

    res.json({
      type: lab.id,
      name: lab.name,
      ttl: lab.ttl,
      ...instance,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
}
