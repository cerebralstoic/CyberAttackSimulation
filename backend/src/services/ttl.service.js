import { stopLab } from "./docker.service.js";

const timers = new Map();

export function scheduleTTL(containerName, ttlMinutes) {
  if (!ttlMinutes) return;

  const ttlMs = ttlMinutes * 60 * 1000;

  const timer = setTimeout(() => {
    stopLab(containerName).finally(() => {
      timers.delete(containerName);
    });
  }, ttlMs);

  timers.set(containerName, timer);
}

export function cancelTTL(containerName) {
  const timer = timers.get(containerName);
  if (timer) {
    clearTimeout(timer);
    timers.delete(containerName);
  }
}
