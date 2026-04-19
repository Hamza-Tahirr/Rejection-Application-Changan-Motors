"use client";

import { motion } from "framer-motion";
import { Factory, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-white/5"
      style={{ background: "var(--navbar-bg)", backdropFilter: "blur(20px)" }}
    >
      <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Factory size={20} className="text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-950" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Changan <span className="gradient-text">Motors</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest -mt-0.5">
              Rejection Management
            </p>
          </div>
        </div>

        {/* Right: Theme Toggle + User */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Bell size={18} className="text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-indigo-500" />
              )}
            </motion.div>
          </button>

          <div className="w-px h-8 bg-white/10 mx-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              HT
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white leading-tight">Hamza Tahir</p>
              <p className="text-[10px] text-slate-500">Quality Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
