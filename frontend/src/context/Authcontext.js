import { ListTodo } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { createUserIfNotExists } from "../services/user.service";

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = ListenToAuthChanges(async (firebaseUser) =>{
            if(firebaseUser){
                await createUserIfNotExists(firebaseUser);

            }
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsub();
    },[]);

    return (
        <AuthContext.Provider value = {{user, loading}}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}