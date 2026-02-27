import { useEffect, useLayoutEffect, useState } from "react";

export type GridSize = 2 | 3 | 4;
export type FontSize = "normal" | "large" | "elder";

// CSS classes that map to CSS variables set by data-font-size on <html>.
// All sizes are defined in globals.css — components just use these class names.
export const fontSizeConfig: Record<FontSize, {
  label: string;
  symbolText: string;
  symbolEmoji: string;
  sentenceText: string;
  ui: string;
  recentLabel: string;
}> = {
  normal:  { label: "ປົກກະຕິ",     symbolText: "aac-symbol-text", symbolEmoji: "aac-symbol-emoji", sentenceText: "aac-sentence-text", ui: "aac-ui", recentLabel: "aac-recent-label" },
  large:   { label: "ໃຫຍ່",         symbolText: "aac-symbol-text", symbolEmoji: "aac-symbol-emoji", sentenceText: "aac-sentence-text", ui: "aac-ui", recentLabel: "aac-recent-label" },
  elder:   { label: "ຜູ້ສູງອາຍຸ",  symbolText: "aac-symbol-text", symbolEmoji: "aac-symbol-emoji", sentenceText: "aac-sentence-text", ui: "aac-ui", recentLabel: "aac-recent-label" },
};

// Apply font size to <html data-font-size="..."> immediately (used by layout script too)
export const applyFontSize = (fontSize: FontSize) => {
  document.documentElement.setAttribute("data-font-size", fontSize);
};

const STORAGE_KEY = "aac-settings";

interface PersistedSettings {
  darkMode: boolean;
  gridSize: GridSize;
  highContrast: boolean;
  fontSize: FontSize;
}

const DEFAULT_SETTINGS: PersistedSettings = {
  darkMode: false,
  gridSize: 4,
  highContrast: false,
  fontSize: "normal",
};

const loadSettings = (): PersistedSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings: PersistedSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    console.warn("Failed to persist settings to localStorage");
  }
};

// useLayoutEffect on client, useEffect on server (for SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const useSettings = () => {
  const [settings, setSettings] = useState<PersistedSettings>(loadSettings);
  const [showSettings, setShowSettings] = useState(false);

  // Apply font size to <html> immediately before paint on every change
  useIsomorphicLayoutEffect(() => {
    applyFontSize(settings.fontSize);
  }, [settings.fontSize]);

  // Apply dark mode class to <html> immediately before paint
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  // Persist all settings to localStorage on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const update = (patch: Partial<PersistedSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  return {
    darkMode: settings.darkMode,
    gridSize: settings.gridSize,
    highContrast: settings.highContrast,
    fontSize: settings.fontSize,
    showSettings,

    toggleDarkMode: () => update({ darkMode: !settings.darkMode }),
    toggleHighContrast: () => update({ highContrast: !settings.highContrast }),
    toggleSettings: () => setShowSettings((v) => !v),
    setGridSize: (gridSize: GridSize) => update({ gridSize }),
    setFontSize: (fontSize: FontSize) => update({ fontSize }),
    setShowSettings,
  };
};