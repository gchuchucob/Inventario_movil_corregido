/**
 * AppContext — gestiona productos, movimientos y finanzas.
 *
 * Modo Firestore: activo cuando VITE_FIREBASE_API_KEY está configurado
 *                 y el usuario tiene storeId. Los datos se sincronizan
 *                 en tiempo real entre todos los dispositivos.
 *
 * Modo localStorage: fallback para desarrollo sin Firebase configurado.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import type { Product, Movement, FinanceTransaction } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function computeStatus(stock: number): Product['status'] {
  if (stock <= 0)  return 'OUT OF STOCK';
  if (stock <= 10) return 'LOW STOCK';
  return 'IN STOCK';
}

const isFirebaseReady = () =>
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'REEMPLAZA_AQUI';

const LS = {
  get: <T,>(key: string, fallback: T): T => {
    try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; } catch { return fallback; }
  },
  set: <T,>(key: string, val: T) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* noop */ }
  },
};

// ─── Tipos del contexto ───────────────────────────────────────────────────────

interface AppContextType {
  products: Product[];
  movements: Movement[];
  finances: FinanceTransaction[];
  isLoadingData: boolean;
  addProduct:         (product:  Omit<Product, 'id'>)             => Promise<void>;
  updateProduct:      (id: string, updates: Partial<Product>)      => Promise<void>;
  deleteProduct:      (id: string)                                  => Promise<void>;
  addMovement:        (movement: Omit<Movement, 'id'>)             => Promise<void>;
  addFinance:         (finance:  Omit<FinanceTransaction, 'id'>)   => Promise<void>;
  findProductByBarcode: (barcode: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { appUser } = useAuth();
  const storeId     = appUser?.storeId ?? null;
  const useFirebase = isFirebaseReady() && !!storeId;

  const [products,      setProducts]      = useState<Product[]>           (() => LS.get('inven_products',  []));
  const [movements,     setMovements]     = useState<Movement[]>          (() => LS.get('inven_movements', []));
  const [finances,      setFinances]      = useState<FinanceTransaction[]>(() => LS.get('inven_finances',  []));
  const [isLoadingData, setIsLoadingData] = useState(useFirebase);

  // ── Firestore listeners (tiempo real) ────────────────────────────────────
  useEffect(() => {
    if (!useFirebase) { setIsLoadingData(false); return; }
    setIsLoadingData(true);

    const prodCol = collection(db, 'stores', storeId!, 'products');
    const movCol  = collection(db, 'stores', storeId!, 'movements');

    const unsubProd = onSnapshot(prodCol, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setIsLoadingData(false);
    });

    const unsubMov = onSnapshot(
      query(movCol, orderBy('createdAtTs', 'desc')),
      snap => setMovements(snap.docs.map(d => ({ id: d.id, ...d.data() } as Movement)))
    );

    return () => { unsubProd(); unsubMov(); };
  }, [useFirebase, storeId]);

  // ── Sync localStorage (fallback) ─────────────────────────────────────────
  useEffect(() => { if (!useFirebase) LS.set('inven_products',  products);  }, [products,  useFirebase]);
  useEffect(() => { if (!useFirebase) LS.set('inven_movements', movements); }, [movements, useFirebase]);
  useEffect(() => { if (!useFirebase) LS.set('inven_finances',  finances);  }, [finances,  useFirebase]);

  // ── Operaciones ───────────────────────────────────────────────────────────

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    const enriched = { ...product, status: computeStatus(product.stock) };
    if (useFirebase) {
      await addDoc(collection(db, 'stores', storeId!, 'products'), enriched);
    } else {
      setProducts(prev => [...prev, { ...enriched, id: genId() }]);
    }
  }, [useFirebase, storeId]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const statusUpdate = updates.stock !== undefined
      ? { status: computeStatus(updates.stock) }
      : {};
    if (useFirebase) {
      await updateDoc(doc(db, 'stores', storeId!, 'products', id), { ...updates, ...statusUpdate });
    } else {
      setProducts(prev => prev.map(p =>
        p.id !== id ? p : { ...p, ...updates, ...statusUpdate } as Product
      ));
    }
  }, [useFirebase, storeId]);

  const deleteProduct = useCallback(async (id: string) => {
    if (useFirebase) {
      await deleteDoc(doc(db, 'stores', storeId!, 'products', id));
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  }, [useFirebase, storeId]);

  const addMovement = useCallback(async (movement: Omit<Movement, 'id'>) => {
    if (useFirebase) {
      await addDoc(collection(db, 'stores', storeId!, 'movements'), {
        ...movement,
        createdAtTs: serverTimestamp(),
        date: movement.date || new Date().toISOString().slice(0, 10),
      });
    } else {
      setMovements(prev => [{ ...movement, id: genId() }, ...prev]);
    }

    // Ajustar stock automáticamente
    if (movement.productId && movement.units) {
      const prod = products.find(p => p.id === movement.productId);
      if (prod) {
        const delta   = movement.type === 'ENTRADA' ? movement.units : -movement.units;
        const newSold = movement.type === 'SALIDA'
          ? (prod.unitsSold ?? 0) + movement.units
          : prod.unitsSold ?? 0;
        await updateProduct(movement.productId, {
          stock: Math.max(0, prod.stock + delta),
          unitsSold: newSold,
        });
      }
    }
  }, [useFirebase, storeId, products, updateProduct]);

  const addFinance = useCallback(async (finance: Omit<FinanceTransaction, 'id'>) => {
    setFinances(prev => [{ ...finance, id: genId() }, ...prev]);
  }, []);

  const findProductByBarcode = useCallback((barcode: string) =>
    products.find(p => p.barcode === barcode || p.sku === barcode),
  [products]);

  return (
    <AppContext.Provider value={{
      products, movements, finances, isLoadingData,
      addProduct, updateProduct, deleteProduct,
      addMovement, addFinance, findProductByBarcode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
