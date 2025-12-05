import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { auth, db } from "@/lib/firebase";      
import { useUserStore } from "@/lib/store";

export function useAuth() {
  const { setUser, clearUser, setLoading } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const uid = firebaseUser.uid;
          const userDocRef = doc(db, "users", uid);
          const userSnap = await getDoc(userDocRef);
          
          let role = 'user'; 
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            role = userData.role || 'user';
          }

          setUser({
            uid: uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: role as 'admin' | 'user', 
          });
        } else {
          clearUser();
        }
      } catch (error) {
        console.error("Помилка авторизації:", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, clearUser, setLoading]);
}