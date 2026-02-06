const API = "http://localhost:5000/api/labs";

export async function startLab(type) {
  const res = await fetch(`${API}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function stopLab(containerName) {
  const res = await fetch(`${API}/stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ containerName }),
  });
  return res.json();
}
