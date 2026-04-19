"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { hasConsented } from "./CookieConsent";

const ThemeContext = createContext({ theme: "dark", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // only read localStorage if user gave functional consent
    if (hasConsented("functional")) {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
      }
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    // only persist if user consented to functional cookies
    if (hasConsented("functional")) {
      localStorage.setItem("theme", next);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
