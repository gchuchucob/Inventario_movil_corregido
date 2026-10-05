/**
 * Cloud Function: createUserProfileOnFirstLogin
 * 
 * Se ejecuta cuando un usuario se autentica por primera vez.
 * Crea automáticamente un documento en /users/{uid} con rol "owner"
 * y una tienda vinculada.
 */

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import type { UserRecord } from "firebase-admin/auth";

admin.initializeApp();
const db = admin.firestore();

export const createUserProfileOnFirstLogin = functions.auth.user().onCreate(
  async (user: UserRecord) => {
    const uid = user.uid;
    const email = user.email || "";
    const displayName = user.displayName || email.split("@")[0];

    console.log(`[onCreate] Nuevo usuario: ${uid} - ${email}`);

    try {
      // Verifica si el documento ya existe
      const userDocRef = db.collection("users").doc(uid);
      const userDocSnap = await userDocRef.get();

      if (userDocSnap.exists) {
        console.log(`[onCreate] Usuario ya existe en Firestore: ${uid}`);
        return;
      }

      // 1. Crear documento de tienda
      const storeRef = await db.collection("stores").add({
        name: `Tienda de ${displayName}`,
        ownerUid: uid,
        ownerEmail: email,
        allowedEmails: [email],
        address: "",
        phone: "",
        createdAt: new Date().toISOString(),
      });

      const storeId = storeRef.id;

      // 2. Crear documento de usuario con rol owner
      await userDocRef.set({
        email,
        displayName,
        role: "owner",
        storeId,
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || "",
      });

      console.log(`[onCreate] ✓ Usuario creado como owner con tienda ${storeId}`);
    } catch (error) {
      console.error(`[onCreate] ✗ Error creando perfil para ${uid}:`, error);
      throw error;
    }
  }
);

/**
 * Cloud Function: addWorkerOnFirstLogin
 * 
 * Si un empleado (cuyo correo está en allowedEmails de una tienda)
 * inicia sesión por primera vez, crea su documento como "worker".
 */
export const addWorkerOnFirstLogin = functions.auth.user().onCreate(
  async (user: UserRecord) => {
    const uid = user.uid;
    const email = user.email || "";

    console.log(`[Worker] Revisando si ${email} es empleado de alguna tienda...`);

    try {
      // Busca tiendas que tengan este correo en allowedEmails
      const storesSnap = await db
        .collection("stores")
        .where("allowedEmails", "array-contains", email)
        .limit(1)
        .get();

      if (storesSnap.empty) {
        console.log(`[Worker] ${email} no está en ninguna allowedEmails.`);
        return;
      }

      const store = storesSnap.docs[0];
      const storeId = store.id;

      // Verifica si el usuario ya existe
      const userDocRef = db.collection("users").doc(uid);
      const userDocSnap = await userDocRef.get();

      if (userDocSnap.exists) {
        console.log(`[Worker] Usuario ya existe: ${uid}`);
        return;
      }

      // Crear documento de usuario como worker
      const displayName = user.displayName || email.split("@")[0];
      await userDocRef.set({
        email,
        displayName,
        role: "worker",
        storeId,
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || "",
      });

      console.log(`[Worker] ✓ Empleado ${email} creado para tienda ${storeId}`);
    } catch (error) {
      console.error(`[Worker] ✗ Error procesando empleado ${email}:`, error);
      throw error;
    }
  }
);
