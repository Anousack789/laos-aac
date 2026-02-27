
"use client";
import { Symbol } from "@/data/symbols";
import { GridSize } from "@/hooks/useSettings";
import { Heart } from "lucide-react";
import React from "react";

const gridCols: Record<GridSize, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

interface SymbolGridProps {
  symbols: Symbol[];
  gridSize: GridSize;
  darkMode: boolean;
  highContrast: boolean;
  isFavorite: (symbol: Symbol) => boolean;
  onSelect: (symbol: Symbol) => void;
  onToggleFavorite: (symbol: Symbol) => void;
}

export const SymbolGrid: React.FC<SymbolGridProps> = ({
  symbols, gridSize, darkMode, highContrast, isFavorite, onSelect, onToggleFavorite,
}) => (
  <div className={`grid ${gridCols[gridSize]} gap-3 md:gap-4`}>
    {symbols.map((symbol) => (
      <button
        key={symbol.id}
        onClick={() => onSelect(symbol)}
        className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-xl ${
          highContrast ? "bg-white border-4 border-black" : symbol.color
        } ${darkMode && !highContrast ? "brightness-90" : ""}`}
      >
        <span className={`aac-symbol-emoji transition-transform group-hover:scale-110 ${highContrast ? "grayscale" : ""}`}>
          {symbol.img}
        </span>
        <span className={`aac-symbol-text font-bold text-center px-2 leading-tight ${
          highContrast ? "text-black" : "text-gray-800"
        }`}>
          {symbol.text}
        </span>

        <div
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(symbol); }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={`w-5 h-5 ${isFavorite(symbol) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </div>
      </button>
    ))}
  </div>
);