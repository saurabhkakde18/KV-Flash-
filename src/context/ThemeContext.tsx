"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeType } from "@/types";

interface ThemeContextType {
  theme: ThemeType;
  resolvedTheme: 'ivory' | 'midnight' | 'emerald' | 'graphite' | 'royal' | 'cyberpunk' | 'amber';
  setTheme: (theme: ThemeType) => void;
  themesList: {
    id: ThemeType;
    name: string;
    description: string;
    bgHex: string;
    cardHex: string;
    accentHex: string;
    textHex: string;
    isDark: boolean;
  }[];
}

export const THEMES_LIST = [
  {
    id: 'midnight' as ThemeType,
    name: 'Executive Sapphire & Gold (Ultra)',
    description: 'Deep royal sapphire with luminous 24K gold accents & specular glass',
    bgHex: '#0A1120',
    cardHex: '#13223F',
    accentHex: '#F59E0B',
    textHex: '#FFFFFF',
    isDark: true
  },
  {
    id: 'ivory' as ThemeType,
    name: 'Swiss Platinum & Gold (Luxury Light)',
    description: 'Crisp porcelain, pure pearl cards with warm champagne gold trim',
    bgHex: '#F4F6F9',
    cardHex: '#FFFFFF',
    accentHex: '#B8860B',
    textHex: '#0B132B',
    isDark: false
  },
  {
    id: 'emerald' as ThemeType,
    name: 'Imperial Jade & Gold (Private Banking)',
    description: 'Deep British racing emerald, 24K gold with mint crystal highlights',
    bgHex: '#061A14',
    cardHex: '#10382D',
    accentHex: '#D4AF37',
    textHex: '#FFFFFF',
    isDark: true
  },
  {
    id: 'amber' as ThemeType,
    name: 'Royal Cognac & Champagne Gold',
    description: 'Rich cognac bronze with luminous amber and velvet wood finish',
    bgHex: '#150F09',
    cardHex: '#302214',
    accentHex: '#F59E0B',
    textHex: '#FFFFFF',
    isDark: true
  },
  {
    id: 'royal' as ThemeType,
    name: 'Monaco Sapphire & Rose Gold',
    description: 'Mediterranean navy slate with brushed metallic rose gold highlights',
    bgHex: '#0C1527',
    cardHex: '#182B4D',
    accentHex: '#FB7185',
    textHex: '#FFFFFF',
    isDark: true
  },
  {
    id: 'cyberpunk' as ThemeType,
    name: 'Amethyst Crystal & Neon Glow',
    description: 'Deep space amethyst with luminous electric lilac glow',
    bgHex: '#0F0B1E',
    cardHex: '#231A45',
    accentHex: '#A855F7',
    textHex: '#FFFFFF',
    isDark: true
  },
  {
    id: 'graphite' as ThemeType,
    name: 'Titanium Centurion & Sky Sapphire',
    description: 'Deep space titanium with luminous cyan sapphire highlights',
    bgHex: '#12151B',
    cardHex: '#222935',
    accentHex: '#38BDF8',
    textHex: '#FFFFFF',
    isDark: true
  },
  {
    id: 'auto' as ThemeType,
    name: 'Auto System Sync',
    description: 'Follows your device system appearance setting automatically',
    bgHex: '#64748B',
    cardHex: '#334155',
    accentHex: '#38BDF8',
    textHex: '#FFFFFF',
    isDark: false
  }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('midnight');
  const [systemDark, setSystemDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("kv_flash_theme") as ThemeType;
    if (saved && THEMES_LIST.some(t => t.id === saved)) {
      setThemeState(saved);
    } else {
      setThemeState('midnight');
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mql.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: 'ivory' | 'midnight' | 'emerald' | 'graphite' | 'royal' | 'cyberpunk' | 'amber' = 
    theme === 'auto' ? (systemDark ? 'midnight' : 'ivory') : theme;

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);
    localStorage.setItem("kv_flash_theme", theme);
  }, [theme, resolvedTheme, mounted]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, themesList: THEMES_LIST }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
