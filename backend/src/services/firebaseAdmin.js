import admin from "firebase-admin";
import serviceAccount from "../config/serviceAccountKey.js";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const adminDb = admin.firestore();
export default admin;