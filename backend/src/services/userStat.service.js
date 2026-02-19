import { adminDb } from "./firebaseAdmin.js";
import admin from "firebase-admin";

export async function incrementUserStat(userId, field) {
  const ref = adminDb.collection("users").doc(userId);

  await ref.update({
    [`stats.${field}`]: admin.firestore.FieldValue.increment(1),
  });
}

export async function createLabHistory(userId, labData) {
  const ref = adminDb
    .collection("users")
    .doc(userId)
    .collection("labHistory")
    .doc();

  console.log("Creating lab history entry for user:", userId, "labData:", labData);
  await ref.set({
    labId: labData.labId,
    name: labData.name,
    category: labData.category,
    difficulty: labData.difficulty,
    containerName: labData.containerName,
    startedAt: admin.firestore.FieldValue.serverTimestamp(),
    completedAt: null,
    attempts: 1,
    success: false,
    durationSeconds: 0,
  });

  return ref.id;
}

export async function completeLabHistoryEntry(userId, historyId) {
  const ref = adminDb
    .collection("users")
    .doc(userId)
    .collection("labHistory")
    .doc(historyId);

  const snap = await ref.get();
  if (!snap.exists) return;

  const data = snap.data();

  let duration = 0;

  if (data.startedAt) {
    const started = data.startedAt.toDate().getTime();
    duration = Math.floor((Date.now() - started) / 1000);
  }

  await ref.update({
    completedAt: admin.firestore.FieldValue.serverTimestamp(),
    success: true,
    durationSeconds: duration,
  });
}
