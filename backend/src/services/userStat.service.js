import { adminDb } from "./firebaseAdmin.js"
import admin from "./firebaseAdmin.js";
import { getFirestore, FieldValue } from "firebase-admin/firestore";


export async function  incrementUserStat(userId, field){
    const ref = adminDb.collection("users").doc(userId);

    await ref.update({
         [`stats.${field}`]: admin.firestore.FieldValue.increment(1),
    });
}
