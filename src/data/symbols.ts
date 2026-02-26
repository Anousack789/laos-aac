import {
  Grid,
  Heart,
  LucideIcon,
  MessageCircle,
  User,
  Utensils,
  Zap,
} from "lucide-react";

import symbolsData from "./symbols.json";

export interface Symbol {
  id: string;
  text: string;
  img: string;
  color: string;
  isCustom?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  icon: LucideIcon;
  color: string;
  symbols: Symbol[];
}

// Map icon names to actual Lucide icons
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Heart,
  Utensils,
  MessageCircle,
  Grid,
  User,
};

// Transform JSON data to Category format with icons
export const symbolCategories: Category[] = symbolsData.categories.map(
  (category) => ({
    id: category.id,
    name: category.name,
    nameEn: category.nameEn,
    icon: iconMap[category.icon] || Grid,
    color: category.color,
    symbols: category.symbols,
  })
);

// Export words dictionary for audio generation sync
export const words: Record<string, string> = {};
symbolCategories.forEach((category) => {
  category.symbols.forEach((symbol) => {
    words[symbol.id] = symbol.text;
  });
});
