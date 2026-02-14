import { adminDb } from "./firebaseAdmin";

export async function  incrementUserStat(userId, field){
    const ref = adminDb.collection("users").doc(userId);

    await ref.update({
         [`stats.${field}`]: admin.firestore.FieldValue.increment(1),
    });
}
