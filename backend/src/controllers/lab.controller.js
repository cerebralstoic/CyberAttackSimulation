import { startSqlLab } from "../services/docker.service.js";
import { startXssLab } from "../services/docker.service.js";

const LAB_STARTERS = {
  sqli: startSqlLab,
  xss: startXssLab
};

export async function startLab(req, res) {
  const { type } = req.body;

  if (!type || !LAB_STARTERS[type]) {
    return res.status(400).json({
      error: "Invalid lab type",
      allowed: Object.keys(LAB_STARTERS)
    });
  }

  try {
    const lab = await LAB_STARTERS[type]();
    res.json({
      type,
      ...lab
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
