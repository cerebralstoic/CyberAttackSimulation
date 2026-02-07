import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";

const googleProvider = new GoogleAuthProvider();

export function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);   
}

export function login(email, password){
    return signInWithEmailAndPassword(auth, email, password);
}
export async function signup(email, password, name){
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, {
        displayName: name,
    });
    return cred;
}

export function resetPassword(email){
    return sendPasswordResetEmail(auth, email);
}

export function logout(){
    return signOut(auth);
}

export function listenToAuthChanges(callback){
    return onAuthStateChanged(auth, callback);
}