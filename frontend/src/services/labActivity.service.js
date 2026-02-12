import { addDoc, collection, serverTimestamp, startAt, updateDoc } from "firebase/firestore";

export async function logLabStart(userId, lab) {
    const ref = await addDoc(collection(db, "labActivity"),{
        userId,
        labID: lab.id,
        category: lab.category,
        status: "runnning",
        startedAt: serverTimestamp(),
        attempts: 1,
    });

    return ref.id;
    
}

export async function logLabStop(activityId, status ="stopped"){
    const ref = await addDoc(collection(db, "labActivity",activityId));
    await updateDoc(ref,{
        status,
        endedAt: serverTimestamp()
    });
}