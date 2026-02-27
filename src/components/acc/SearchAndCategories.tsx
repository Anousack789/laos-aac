"use client";
import { Search, X } from "lucide-react";
import React from "react";
import { Category } from "@/data/symbols";

interface SearchBarProps {
  query: string;
  darkMode: boolean;
  onChange: (query: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, darkMode, onChange, onClear }) => (
  <div className="mb-6 relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      value={query}
      onChange={(e) => onChange(e.target.value)}
      placeholder="ຊອກຫາສັນຍາລັກ..."
      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
          : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 shadow-sm"
      }`}
    />
    {query && (
      <button onClick={onClear} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors">
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  darkMode: boolean;
  onSelect: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeId, darkMode, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
    {categories.map((category) => {
      const Icon = category.icon;
      const isActive = activeId === category.id;
      return (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all transform hover:scale-105 ${
            isActive
              ? `bg-linear-to-r ${category.color} text-white shadow-lg scale-105`
              : darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm"
          }`}
        >
          <Icon className="w-5 h-5" />
          {category.name}
        </button>
      );
    })}
  </div>
);