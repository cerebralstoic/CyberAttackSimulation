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

export async function updateUserStreak(userId){
  const ref  = adminDb.collection("users").doc(userId);
  const snap = await ref.get();

  if(!snap.exists) return;

  const data = snap.data();
  const streak = data.streak || {
    current: 0,
    longest: 0,
    lastCompletedDate: null
  };
  const today = new Date();
  const todaystr = today.toISOString().split("T")[0];
  const lastDate = streak.LastCompletedDate;

  if(!lastDate){
    await ref.update({
      "streak.current":1,
      "streak.longest":1,
      "streak.lastCompletedDate": todaystr
    });
    return ;
  }

  const yesterday = new Date();
  yesterday.setDate(today.getDate()-1);
  const yesterdaystr = yesterday.toISOString().split("T")[0];

  if(lastDate === todaystr){
    return;
  }
  if(lastDate === yesterdaystr){
    const newcurrent = streak.current +1;
    await ref.update({
      "streak.current": newcurrent,
      "streak.longest": Math.max(newcurrent, streak.longest),
      "streak.lastCompletedDate": todaystr
    });
  }else{
    await ref.update({
      "streak.current": 1,
      "streak.lastCompletedDate": todaystr
    });
  }

}
