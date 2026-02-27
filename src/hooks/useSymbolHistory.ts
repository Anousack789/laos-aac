import { useState } from "react";
import { Symbol } from "../data/symbols";

export const useSymbolHistory = () => {
  const [favorites, setFavorites] = useState<Symbol[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<Symbol[]>([]);

  const addToRecent = (symbol: Symbol) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((s) => s.id !== symbol.id);
      return [symbol, ...filtered].slice(0, 8);
    });
  };

  const toggleFavorite = (symbol: Symbol) => {
    setFavorites((prev) =>
      prev.find((f) => f.id === symbol.id)
        ? prev.filter((f) => f.id !== symbol.id)
        : [...prev, symbol]
    );
  };

  const isFavorite = (symbol: Symbol) => favorites.some((f) => f.id === symbol.id);

  return { favorites, recentlyUsed, addToRecent, toggleFavorite, isFavorite };
};