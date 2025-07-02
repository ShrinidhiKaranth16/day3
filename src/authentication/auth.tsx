import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { createContext,  useEffect, useState } from "react";
import type { User } from "firebase/auth";

type Role = "admin" | "viewer";

interface AuthContextType {
  user: User | null;
  role: Role;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>("viewer");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser?.email) {
        try {
          // 👇 Reference the single document that contains the adminEmail array
          const adminDoc = await getDoc(doc(db, "admin", "Qc0xbBRJ7Y5fsm8EBI4f"));

          if (adminDoc.exists()) {
            const adminList = adminDoc.data().adminEmail as string[];
            console.log(adminList);
            if (adminList.includes(firebaseUser.email)) {
              setRole("admin");
            } else {
              setRole("viewer");
            }
          } else {
            setRole("viewer");
          }
        } catch (err) {
          console.error("Error checking admin list:", err);
          setRole("viewer");
        }
      } else {
        setRole("viewer");
      }
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


