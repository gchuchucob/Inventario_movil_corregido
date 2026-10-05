import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCCIONES:
//  1. Ve a https://console.firebase.google.com
//  2. Crea proyecto → agrega app Web → copia la config de abajo
//  3. Activa Authentication → Email/Password y Google
//  4. Activa Firestore Database (modo producción)
//  5. Copia las reglas de src/lib/firestore.rules en la consola
//  6. Crea un archivo .env en la raíz con los valores (ver .env.example)
// ─────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY             ?? '=AIzaSyCgtBBoqxT7g0PLBQz_M4FpKc1u32a7iy4',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN         ?? 'inven-movil.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID          ?? 'inven-movil',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET      ?? 'inven-movil.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '1070487059807',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              ?? '1:1070487059807:web:808057176fa383b8d6caea',
};

// Evita reinicializar en HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth           = getAuth(app);
export const db             = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
