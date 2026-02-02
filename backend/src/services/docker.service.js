import { exec } from "child_process";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";

export function startSqlLab() {
  return new Promise((resolve, reject) => {
    const containerName = `sqli_lab_${crypto.randomUUID().slice(0, 8)}`;
    const port = Math.floor(3000 + Math.random() * 6000);

    const network = isProd ? "lab_net" : "bridge";

    const cmd = `docker run -d \
      --name ${containerName} \
      -p 127.0.0.1:${port}:80 \
      --network ${network} \
      --memory ${process.env.LAB_MEMORY || "256m"} \
      --cpus="${process.env.LAB_CPUS || "0.5"}" \
      --pids-limit 100 \
      sqli-lab
    `;

    exec(cmd, (err, stdout, stderr) => {
  console.log("DOCKER CMD:", cmd);
  console.log("DOCKER STDOUT:", stdout);
  console.log("DOCKER STDERR:", stderr);

  if (err) {
    return reject(new Error(stderr || err.message));
  }

  resolve({
    containerName,
    url: `http://localhost:${port}`
  });
});

  });
}

export function startCmdiLab() {
  return new Promise((resolve, reject) => {
    const containerName = `cmdi_lab_${crypto.randomUUID().slice(0, 8)}`;
    const port = Math.floor(3000 + Math.random() * 6000);

    const network = isProd ? "lab_net" : "bridge";

    const cmd = `docker run -d \
      --name ${containerName} \
      -p 127.0.0.1:${port}:80 \
      --network ${network} \
      --memory ${process.env.LAB_MEMORY || "256m"} \
      --cpus="${process.env.LAB_CPUS || "0.5"}" \
      --pids-limit 100 \
      cmdi-lab
    `;

    exec(cmd, (err, stdout, stderr) => {
      console.log("DOCKER CMD:", cmd);
      console.log("DOCKER STDOUT:", stdout);
      console.log("DOCKER STDERR:", stderr);

      if (err) {
        return reject(new Error(stderr || err.message));
      }

      resolve({
        containerName,
        url: `http://localhost:${port}`,
      });
    });
  });
}


export function startXssLab() {
  return new Promise((resolve, reject) => {
    const containerName = `xss_lab_${crypto.randomUUID().slice(0, 8)}`;
    const port = Math.floor(3000 + Math.random() * 6000);

    const network = isProd ? "lab_net" : "bridge";

    const cmd = `docker run -d \
      --name ${containerName} \
      -p 127.0.0.1:${port}:80 \
      --network ${network} \
      --memory ${process.env.LAB_MEMORY || "256m"} \
      --cpus="${process.env.LAB_CPUS || "0.5"}" \
      --pids-limit 100 \
      xss-lab
    `;

    exec(cmd, (err, stdout, stderr) => {
      console.log("DOCKER CMD:", cmd);
      console.log("DOCKER STDOUT:", stdout);
      console.log("DOCKER STDERR:", stderr);

      if (err) {
        return reject(new Error(stderr || err.message));
      }

      resolve({
        containerName,
        url: `http://localhost:${port}`
      });
    });
  });
}

export function stopLab(containerName) {
  return new Promise((resolve, reject) => {
    exec(`docker rm -f ${containerName}`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
