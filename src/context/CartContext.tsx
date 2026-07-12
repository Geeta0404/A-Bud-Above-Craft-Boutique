"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";
import { useAuthUserId } from "@/hooks/useAuthUserId";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKeyFor = (userId: string) => `aba-cart-${userId}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const userId = useAuthUserId();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  // Re-hydrate from this account's own storage bucket whenever the signed-in user changes.
  useEffect(() => {
    setHydrated(false);
    try {
      const raw = localStorage.getItem(storageKeyFor(userId));
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(storageKeyFor(userId), JSON.stringify(items));
  }, [items, hydrated, userId]);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setCartOpen(true);
  };

  const removeItem = (slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug));

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) return removeItem(slug);
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        isCartOpen,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
