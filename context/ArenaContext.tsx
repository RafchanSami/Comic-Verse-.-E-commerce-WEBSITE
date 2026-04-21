import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';

interface ArenaContextType {
  fighters: Product[];
  addFighter: (product: Product) => void;
  removeFighter: (productId: string) => void;
  clearArena: () => void;
  isInArena: (productId: string) => boolean;
}

const ArenaContext = createContext<ArenaContextType | undefined>(undefined);

export const ArenaProvider = ({ children }: { children?: ReactNode }) => {
  const [fighters, setFighters] = useState<Product[]>([]);

  const addFighter = (product: Product) => {
    if (fighters.length < 2 && !fighters.find(f => f.id === product.id)) {
      setFighters(prev => [...prev, product]);
    }
  };

  const removeFighter = (productId: string) => {
    setFighters(prev => prev.filter(f => f.id !== productId));
  };

  const clearArena = () => setFighters([]);

  const isInArena = (productId: string) => fighters.some(f => f.id === productId);

  return (
    <ArenaContext.Provider value={{ fighters, addFighter, removeFighter, clearArena, isInArena }}>
      {children}
    </ArenaContext.Provider>
  );
};

export const useArena = () => {
  const context = useContext(ArenaContext);
  if (!context) throw new Error("useArena must be used within an ArenaProvider");
  return context;
};