import { exec } from "child_process";

const timers = new Map();

export function scheduleTTL(containerName, ttlMinutes) {
  if (!ttlMinutes) return;
  const ttlMs = ttlMinutes * 60 * 1000;

  const timer = setTimeout(() => {
    
    exec(`docker rm -f ${containerName}`, () => {
      timers.delete(containerName);
    });
  }, ttlMs);

  timers.set(containerName, timer);
}
