const activeLabs = new Map();

export function scheduleLabCleanup(containerName, minutes = 30) {
  const timeout = setTimeout(() => {
    import("./docker.service.js").then(({ stopLab }) => {
      stopLab(containerName);
    });
  }, minutes * 60 * 1000);

  activeLabs.set(containerName, timeout);
}
