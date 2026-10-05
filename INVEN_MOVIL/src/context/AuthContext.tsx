import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, collection, addDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import type { AppUser, Store, UserRole } from '../types';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  store: Store | null;
  isLoading: boolean;
  loginEmail:    (email: string, password: string) => Promise<void>;
  loginGoogle:   () => Promise<void>;
  registerOwner: (email: string, password: string, name: string, storeName: string) => Promise<void>;
  logout:        () => Promise<void>;
  refreshUser:   () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchAppUser(uid: string): Promise<{ appUser: AppUser; store: Store } | null> {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (!userSnap.exists()) return null;

  const userData = userSnap.data() as Omit<AppUser, 'uid'>;
  const appUser: AppUser = { uid, ...userData };

  const storeSnap = await getDoc(doc(db, 'stores', appUser.storeId));
  if (!storeSnap.exists()) return null;

  const store: Store = { id: appUser.storeId, ...(storeSnap.data() as Omit<Store, 'id'>) };
  return { appUser, store };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser]           = useState<AppUser | null>(null);
  const [store, setStore]               = useState<Store | null>(null);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const result = await fetchAppUser(fbUser.uid);
          if (result) {
            setAppUser(result.appUser);
            setStore(result.store);
          } else {
            setAppUser(null);
            setStore(null);
          }
        } catch {
          setAppUser(null);
          setStore(null);
        }
      } else {
        setAppUser(null);
        setStore(null);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const refreshUser = async () => {
    if (!firebaseUser) return;
    const result = await fetchAppUser(firebaseUser.uid);
    if (result) {
      setAppUser(result.appUser);
      setStore(result.store);
    }
  };

  const loginEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const registerOwner = async (
    email: string,
    password: string,
    name: string,
    storeName: string
  ) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = credential.user;
    await updateProfile(fbUser, { displayName: name });

    // 1. Crear tienda
    const storeRef = await addDoc(collection(db, 'stores'), {
      name: storeName,
      ownerUid: fbUser.uid,
      ownerEmail: email,
      allowedEmails: [],
      createdAt: new Date().toISOString(),
    });

    // 2. Crear perfil de usuario con rol owner
    await setDoc(doc(db, 'users', fbUser.uid), {
      email,
      displayName: name,
      role: 'owner' as UserRole,
      storeId: storeRef.id,
      createdAt: new Date().toISOString(),
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser, appUser, store, isLoading,
        loginEmail, loginGoogle, registerOwner, logout, refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
