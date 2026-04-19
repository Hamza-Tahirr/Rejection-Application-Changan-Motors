"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cookie, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "gdpr_consent";
const CONSENT_VERSION = "1.0";

export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasConsented(category) {
  const consent = getConsent();
  if (!consent) return false;
  return !!consent.categories?.[category];
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      // small delay so the page loads first
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function saveConsent(categories) {
    const record = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      categories,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    setVisible(false);
    // reload so ThemeProvider can now use localStorage
    window.location.reload();
  }

  function handleAcceptAll() {
    saveConsent({ necessary: true, functional: true, analytics: true });
  }

  function handleAcceptSelected() {
    saveConsent({ ...preferences, necessary: true });
  }

  function handleRejectNonEssential() {
    saveConsent({ necessary: true, functional: false, analytics: false });
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
          />

          {/* Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[95] p-4 md:p-6"
          >
            <div className="max-w-4xl mx-auto glass-card p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                  <Shield size={24} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-1">
                    Your Privacy Matters
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    We use cookies and local storage to enhance your experience.
                    Under GDPR (General Data Protection Regulation), we need your
                    explicit consent before storing any non-essential data on your device.
                    You can change your preferences at any time.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Read our{" "}
                    <Link href="/privacy" className="text-indigo-400 hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms" className="text-indigo-400 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    for full details.
                  </p>
                </div>
              </div>

              {/* Cookie Details Toggle */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
              >
                <Cookie size={14} />
                Manage cookie preferences
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showDetails ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="space-y-3 p-4 rounded-xl border border-white/5" style={{ background: "var(--bg-card-inner)" }}>
                      {/* Necessary */}
                      <ConsentRow
                        label="Strictly Necessary"
                        description="Required for the application to function. Cannot be disabled."
                        checked={true}
                        disabled={true}
                      />
                      {/* Functional */}
                      <ConsentRow
                        label="Functional"
                        description="Stores your theme preference (dark/light mode) and UI settings."
                        checked={preferences.functional}
                        onChange={(v) => setPreferences((p) => ({ ...p, functional: v }))}
                      />
                      {/* Analytics */}
                      <ConsentRow
                        label="Analytics"
                        description="Anonymous usage data to improve the application. Currently not active."
                        checked={preferences.analytics}
                        onChange={(v) => setPreferences((p) => ({ ...p, analytics: v }))}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleAcceptAll} className="btn btn-primary">
                  Accept All
                </button>
                {showDetails && (
                  <button onClick={handleAcceptSelected} className="btn btn-ghost">
                    Save Preferences
                  </button>
                )}
                <button onClick={handleRejectNonEssential} className="btn btn-ghost text-sm">
                  Reject Non-Essential
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ConsentRow({ label, description, checked, disabled, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
        className="mt-1"
      />
      <div className="flex-1">
        <span className="text-sm font-medium text-white block">
          {label}
          {disabled && (
            <span className="ml-2 text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              Always Active
            </span>
          )}
        </span>
        <span className="text-xs text-slate-400">{description}</span>
      </div>
    </label>
  );
}
