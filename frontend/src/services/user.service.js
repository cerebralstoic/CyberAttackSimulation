import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment} from "firebase/firestore";
import {db} from "../firebase/firebase";

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

export async function incrementUserStat(userId, field){
  const ref = doc(db,"users", userId);
  await updateDoc(ref, {
    [`stats.${field}`]: increment(1)
  });
}
