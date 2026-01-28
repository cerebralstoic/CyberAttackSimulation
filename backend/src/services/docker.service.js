import { exec } from "child_process";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";

export function startSqlLab() {
  return new Promise((resolve, reject) => {
    const containerName = `sqli_lab_${crypto.randomUUID().slice(0, 8)}`;
    const port = Math.floor(3000 + Math.random() * 6000);

    const network = isProd ? "lab_net" : "bridge";

    const cmd = `
      docker run -d \
      --name ${containerName} \
      -p 127.0.0.1:${port}:80 \
      --network ${network} \
      --memory ${process.env.LAB_MEMORY || "256m"} \
      --cpus="${process.env.LAB_CPUS || "0.5"}" \
      --pids-limit 100 \
      sqli-lab
    `;

    exec(cmd, (err) => {
      if (err) return reject(err);

      resolve({
        containerName,
        url: `http://localhost:${port}`
      });
    });
  });
}
