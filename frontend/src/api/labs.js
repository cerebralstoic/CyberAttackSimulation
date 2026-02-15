const API = "http://localhost:5000/api/labs";

import { auth } from "../firebase/firebase";

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function startLab(type) {
  const headers = await getAuthHeader();

  const res = await fetch(`${API}/start`, {
    method: "POST",
    headers,
    body: JSON.stringify({ type }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to start lab");
  }

  return res.json();
}

export async function stopLab(containerName) {
  const headers = await getAuthHeader();

  const res = await fetch(`${API}/stop`, {
    method: "POST",
    headers,
    body: JSON.stringify({ containerName }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to stop lab");
  }

  return res.json();
}
