import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Theme } from "@/lib/types";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);

// Apply theme to document
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.classList.toggle("dark", systemTheme === "dark");
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
} 