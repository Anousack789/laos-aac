"use client";
import { Symbol } from "@/data/symbols";
import { Home, Plus, Settings } from "lucide-react";
import React from "react";

interface RecentlyUsedProps {
  symbols: Symbol[];
  darkMode: boolean;
  onSelect: (symbol: Symbol) => void;
}

export const RecentlyUsed: React.FC<RecentlyUsedProps> = ({ symbols, darkMode, onSelect }) => {
  if (symbols.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        ໃຊ້ຫຼ້າສຸດ
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {symbols.map((symbol, idx) => (
          <button
            key={`recent-${symbol.id}-${idx}`}
            onClick={() => onSelect(symbol)}
            className={`shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 shadow-sm ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            }`}
          >
            <span className="text-2xl">{symbol.img}</span>
            <span className={`aac-recent-label font-medium truncate w-full px-1 text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {symbol.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface FooterNavProps {
  darkMode: boolean;
  activeCategory: string;
  showSettings: boolean;
  onHome: () => void;
  onTextInput: () => void;
  onSettings: () => void;
}

export const FooterNav: React.FC<FooterNavProps> = ({
  darkMode, activeCategory, showSettings, onHome, onTextInput, onSettings,
}) => (
  <footer className={`fixed bottom-0 left-0 right-0 border-t backdrop-blur-md transition-colors ${
    darkMode ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-gray-200"
  }`}>
    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-around items-center">
      <button
        onClick={onHome}
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          activeCategory === "quick" ? "text-blue-500" : darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs">ໜ້າຫຼັກ</span>
      </button>

      <button
        onClick={onTextInput}
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg -mt-8 border-4 border-white dark:border-gray-900">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs">ພິມຂໍ້ຄວາມ</span>
      </button>

      <button
        onClick={onSettings}
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          showSettings ? "text-blue-500" : darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        <Settings className="w-6 h-6" />
        <span className="text-xs">ຕັ້ງຄ່າ</span>
      </button>
    </div>
  </footer>
);