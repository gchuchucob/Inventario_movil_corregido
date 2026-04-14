import React, { createContext, useContext, useState } from 'react';
import { Product, Movement, FinanceTransaction } from '../types';

interface AppContextType {
  products: Product[];
  movements: Movement[];
  finances: FinanceTransaction[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  addMovement: (movement: Omit<Movement, 'id'>) => void;
  addFinance: (finance: Omit<FinanceTransaction, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [finances, setFinances] = useState<FinanceTransaction[]>([]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    setProducts(prev => [...prev, newProduct]);
  };

  const addMovement = (movement: Omit<Movement, 'id'>) => {
    const newMovement = { ...movement, id: Math.random().toString(36).substr(2, 9) };
    setMovements(prev => [...prev, newMovement]);
  };

  const addFinance = (finance: Omit<FinanceTransaction, 'id'>) => {
    const newFinance = { ...finance, id: Math.random().toString(36).substr(2, 9) };
    setFinances(prev => [...prev, newFinance]);
  };

  return (
    <AppContext.Provider value={{ products, movements, finances, addProduct, addMovement, addFinance }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
