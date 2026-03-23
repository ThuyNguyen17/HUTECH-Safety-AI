import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { auth } from "../firebase"; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' | 'user' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    const unsubIdToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setRole(null);
        return;
      }
      try {
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        const isAdmin = !!idTokenResult?.claims?.admin;
        setRole(isAdmin ? "admin" : "user");
      } catch (err) {
        console.error("Error getting ID token result:", err);
        setRole(null);
      }
    });

    return () => {
      unsubAuth();
      unsubIdToken();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
