export type Product = {
  id: string;
  sku: string;
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
  amount?: number;
  units?: number;
};

export type FinanceTransaction = {
  id: string;
  title: string;
  type: 'Inversión' | 'Ganancias' | 'Cripto';
  date: string;
  amount: number;
  status: 'COMPLETADO' | 'RECIBIDO';
};
