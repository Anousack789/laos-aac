import { useState } from "react";
import { Symbol } from "../data/symbols";

export interface SentenceItem extends Symbol {
  uniqueId: string;
}

export const useSentence = () => {
  const [sentence, setSentence] = useState<SentenceItem[]>([]);

  const addItem = (symbol: Symbol): SentenceItem => {
    const item: SentenceItem = { ...symbol, uniqueId: `${symbol.id}-${Date.now()}` };
    setSentence((prev) => [...prev, item]);
    return item;
  };

  const removeItem = (index: number) => {
    setSentence((prev) => prev.filter((_, i) => i !== index));
  };

  const clear = () => setSentence([]);

  return { sentence, addItem, removeItem, clear };
};