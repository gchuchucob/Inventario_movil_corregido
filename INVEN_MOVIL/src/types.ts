// ─── Inventario ───────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  maxStock: number;
  imageUrl: string;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  unitsSold?: number;
  badge?: string;
};

export type Movement = {
  id: string;
  type: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  title: string;
  date: string;
  reference: string;
  productId?: string;
  barcode?: string;
  amount?: number;
  units?: number;
  createdBy?: string;       // uid del usuario que registró
  createdByName?: string;   // nombre para mostrar
};

export type FinanceTransaction = {
  id: string;
  title: string;
  type: 'Inversión' | 'Ganancias' | 'Cripto';
  date: string;
  amount: number;
  status: 'COMPLETADO' | 'RECIBIDO';
};

// ─── Usuarios y tiendas ───────────────────────────────────────────────────────

/** Rol dentro de una tienda */
export type UserRole = 'owner' | 'worker';

/** Documento guardado en Firestore: /users/{uid} */
export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  storeId: string;
  createdAt: string;
};

/** Documento guardado en Firestore: /stores/{storeId} */
export type Store = {
  id: string;
  name: string;
  ownerUid: string;
  ownerEmail: string;
  /** Correos que el dueño ha autorizado como empleados */
  allowedEmails: string[];
  address?: string;
  phone?: string;
  createdAt: string;
};
