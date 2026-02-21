const API = "http://localhost:5000/api/labs";

import { auth } from "../firebase/firebase";
import { markLabCompleted, markLabStarted } from "../services/user.service";

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function startLab(type, userId) {
  const headers = await getAuthHeader();

  const res = await fetch(`${API}/start`, {
    method: "POST",
    headers,
    body: JSON.stringify({ type }),
  });

  const data = await res.json();
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to start lab");
  }else{
    markLabStarted(userId);
  }

  return data;
}

export async function stopLab(containerName, historyId) {
  const headers = await getAuthHeader();

  const res = await fetch(`${API}/stop`, {
    method: "POST",
    headers,
    body: JSON.stringify({ containerName, historyId}),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to stop lab");
  }

  return res.json();
}

export async function completeLab(historyId, flag, type, userId){
  const headers = await getAuthHeader();

  const res = await fetch(`${API}/complete`, {
    method: "POST",
    headers,
    body: JSON.stringify({historyId, flag, type}),
  });

  const data = await res.json();

  if(!res.ok){
    throw new Error(data.error || "Failed to complete lab");
  }else{
    await markLabCompleted(userId);
  }

  return data;
}
