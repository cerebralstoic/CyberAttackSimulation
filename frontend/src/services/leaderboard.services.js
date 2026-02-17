import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export function subscribeToLeaderboard(callback) {
  const q = query(
    collection(db, "users"),
    orderBy("stats.totalLabsCompleted", "desc"),
    limit(10)
  );

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data(),
    }));

    callback(users);
  });
}
