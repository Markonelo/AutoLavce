"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/i18n";

interface LanguageValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** false until the stored preference has been read on the client */
  ready: boolean;
}

const LanguageContext = createContext<LanguageValue | null>(null);
const STORAGE_KEY = "autolavce:lang";
const COOKIE_KEY = "lang";

function readStored(): Lang | null {
  if (typeof document === "undefined") return null;
  try {
    const fromLs = localStorage.getItem(STORAGE_KEY);
    if (fromLs === "mk" || fromLs === "en") return fromLs;
  } catch {
    /* ignore */
  }
  const m = document.cookie.match(/(?:^|;\s*)lang=(mk|en)/);
  return (m?.[1] as Lang) ?? null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start as "mk" so the server-rendered markup and the first client
  // render agree (no hydration mismatch). We flip to a stored "en" on mount.
  const [lang, setLangState] = useState<Lang>("mk");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored && stored !== "mk") setLangState(stored);
    setReady(true);
  }, []);

  // Keep <html lang> + storage in sync whenever the language changes.
  useEffect(() => {
    if (!ready) return;
    try {
      document.documentElement.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      // 1-year cookie so a returning visitor's preference is available.
      document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* ignore */
    }
  }, [lang, ready]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === "mk" ? "en" : "mk")),
    []
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe fallback so a component never crashes outside the provider.
    return { lang: "mk", setLang: () => {}, toggle: () => {}, ready: false };
  }
  return ctx;
}
