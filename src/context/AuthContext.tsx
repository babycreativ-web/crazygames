"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Merge favorites when logging in
      if (currentUser) {
        try {
          const globalFavs = localStorage.getItem("favorites_games");
          const userFavsKey = `favorites_${currentUser.uid}`;
          const userFavs = localStorage.getItem(userFavsKey);

          let mergedList: string[] = [];
          if (globalFavs) {
            const list = JSON.parse(globalFavs);
            if (Array.isArray(list)) mergedList = [...list];
          }
          if (userFavs) {
            const list = JSON.parse(userFavs);
            if (Array.isArray(list)) {
              list.forEach((id) => {
                if (!mergedList.includes(id)) mergedList.push(id);
              });
            }
          }

          localStorage.setItem("favorites_games", JSON.stringify(mergedList));
          localStorage.setItem(userFavsKey, JSON.stringify(mergedList));
          // Dispatch custom event to trigger local storage state sync across components
          window.dispatchEvent(new Event("favorites-updated"));
        } catch (e) {
          console.error("Failed to sync favorites on login", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Force prompt account selection to ensure user can choose their Gmail account
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
