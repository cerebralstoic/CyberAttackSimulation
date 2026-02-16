import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function createUserIfNotExists(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      name: user.displayName || "",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      stats: {
        totalLabsStarted: 0,
        totalLabsCompleted: 0,
        totalAttempts: 0,
      },
    });
  } else {
    await updateDoc(ref, {
      lastLogin: serverTimestamp(),
    });
  }
}

export async function incrementUserStat(userId, field) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("User document not found");
  }

  await updateDoc(ref, {
    [`stats.${field}`]: increment(1),
  });
}

export async function markLabStarted(userId) {
  await updateDoc(doc(db, "users", userId), {
    "stats.totalLabsStarted": increment(1),
  });
}

export async function markLabCompleted(userId) {
  await updateDoc(doc(db, "users", userId), {
    "stats.totalLabsCompleted": increment(1),
  });
}

export async function incrementAttempt(userId) {
  await updateDoc(doc(db, "users", userId), {
    "stats.totalAttempts": increment(1),
  });
}

export function listenToUserStats(userId, callback) {
  const ref = doc(db, "users", userId);

  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data().stats);
    } else {
      callback(null);
    }
  });
}