import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type CartItem = {
  productId: string;
  name: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
};

type AddCartItemPayload = {
  productId: string;
  name: string;
  imageUrl: string | null;
  price: number;
  quantity?: number;
};

type CartContextValue = {
  isHydrated: boolean;
  items: CartItem[];
  addItem: (payload: AddCartItemPayload) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CART_STORAGE_KEY = "task.mobile.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

function normalizeItems(items: CartItem[]): CartItem[] {
  return items
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      ...item,
      quantity: Math.max(1, Math.floor(item.quantity)),
      price: Number(item.price),
    }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateCart() {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (!stored) {
          return;
        }

        const parsed = JSON.parse(stored) as unknown;
        if (!Array.isArray(parsed) || !isMounted) {
          return;
        }

        setItems(normalizeItems(parsed as CartItem[]));
      } catch {
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    hydrateCart();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)).catch(() => {
      // Keep UX smooth even if persistence fails.
    });
  }, [items, isHydrated]);

  const addItem = useCallback((payload: AddCartItemPayload) => {
    setItems((prev) => {
      const quantity = Math.max(1, Math.floor(payload.quantity ?? 1));
      const existing = prev.find((item) => item.productId === payload.productId);

      if (existing) {
        return prev.map((item) =>
          item.productId === payload.productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                name: payload.name,
                imageUrl: payload.imageUrl,
                price: payload.price,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: payload.productId,
          name: payload.name,
          imageUrl: payload.imageUrl,
          price: payload.price,
          quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.floor(quantity) } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      isHydrated,
      items,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      totalItems,
      subtotal,
    }),
    [addItem, clearCart, isHydrated, items, removeItem, setQuantity, subtotal, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used inside CartProvider");
  }

  return context;
}

export type { CartItem, AddCartItemPayload };
