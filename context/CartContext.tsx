import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, PromoCode } from '../types';
import { db } from '../services/mockDb';

export const SHIPPING_RATES = [
  { id: 'kandirpar', label: 'Kandirpar, Cumilla', price: 60 },
  { id: 'cumilla', label: 'Cumilla City', price: 120 },
  { id: 'outside', label: 'Outside Cumilla', price: 160 }
];

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => Promise<boolean>;
  removePromo: () => void;
  setShipping: (price: number) => void;
  shippingCost: number;
  total: number;
  subtotal: number;
  discount: number;
  appliedPromo: PromoCode | null;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children?: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(160); // Default to highest

  useEffect(() => {
    const stored = localStorage.getItem('cv_cart');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('cv_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setItems(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const applyPromo = async (code: string): Promise<boolean> => {
    const promo = await db.validatePromo(code);
    if (promo) {
      setAppliedPromo(promo);
      return true;
    }
    return false;
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'PERCENTAGE') {
      discount = Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      discount = appliedPromo.value;
    }
  }
  // Ensure discount doesn't exceed subtotal
  discount = Math.min(discount, subtotal);

  const total = subtotal - discount; // Shipping added separately in views or final total
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, clearCart, 
      applyPromo, removePromo, appliedPromo, setShipping: setShippingCost, shippingCost,
      subtotal, discount, total, itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};