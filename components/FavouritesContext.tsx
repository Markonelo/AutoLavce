"use client";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface FavouritesValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
  ready: boolean;
}

const FavouritesContext = createContext<FavouritesValue | null>(null);
const STORAGE_KEY = "autolavce:favourites";

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids, ready]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <FavouritesContext.Provider value={{ ids, has, toggle, count: ids.length, ready }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites(): FavouritesValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    // Safe fallback so components never crash if used outside the provider.
    return { ids: [], has: () => false, toggle: () => {}, count: 0, ready: false };
  }
  return ctx;
}
