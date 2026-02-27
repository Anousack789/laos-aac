"use client";
import { Symbol, symbolCategories } from "@/data/symbols";
import { useAudio } from "@/hooks/useAudio";
import { useSentence } from "@/hooks/useSentence";
import { useSettings } from "@/hooks/useSettings";
import { useSymbolHistory } from "@/hooks/useSymbolHistory";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { Header } from "./Header";
import { RecentlyUsed } from "./RecentlyUsedAndFooter";
import { CategoryTabs, SearchBar } from "./SearchAndCategories";
import { SettingsPanel } from "./SettingsPanel";
import { SymbolGrid } from "./SymbolGrid";
import { TextInputModal } from "./TextInputModal";

const AACApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("quick");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);

  const { isSpeaking, speak, speakSequence, stopAudio } = useAudio();
  const { sentence, addItem, removeItem, clear } = useSentence();
  const { recentlyUsed, addToRecent, toggleFavorite, isFavorite } =
    useSymbolHistory();
  const {
    darkMode,
    gridSize,
    highContrast,
    showSettings,
    fontSize,
    toggleDarkMode,
    toggleHighContrast,
    toggleSettings,
    setGridSize,
    setFontSize,
  } = useSettings();

  const handleSymbolSelect = (symbol: Symbol) => {
    addItem(symbol);
    addToRecent(symbol);
    speak(symbol.text, symbol.id);
  };

  const handleCustomTextSubmit = (text: string) => {
    const customSymbol: Symbol = {
      id: `custom-${Date.now()}`,
      text,
      img: "💬",
      color: "bg-gray-100",
      isCustom: true,
    };
    handleSymbolSelect(customSymbol);
    setShowTextInput(false);
  };

  const handleClearSentence = () => {
    clear();
    stopAudio();
  };

  const handleSpeakSentence = () => {
    speakSequence(sentence.map((s) => ({ text: s.text, id: s.id })));
  };

  const displaySymbols: Symbol[] = searchQuery
    ? symbolCategories
        .flatMap((c) => c.symbols)
        .filter((s) => s.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : (symbolCategories.find((c) => c.id === activeCategory)?.symbols ?? []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-linear-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <Header
        sentence={sentence}
        isSpeaking={isSpeaking}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onToggleSettings={toggleSettings}
        onRemoveItem={removeItem}
        onClear={handleClearSentence}
        onSpeak={handleSpeakSentence}
      />

      {showSettings && (
        <SettingsPanel
          darkMode={darkMode}
          gridSize={gridSize}
          highContrast={highContrast}
          fontSize={fontSize}
          onGridSizeChange={setGridSize}
          onToggleHighContrast={toggleHighContrast}
          onFontSizeChange={setFontSize}
          onOpenTextInput={() => setShowTextInput(true)}
        />
      )}

      {showTextInput && (
        <TextInputModal
          darkMode={darkMode}
          onSubmit={handleCustomTextSubmit}
          onClose={() => setShowTextInput(false)}
        />
      )}

      <main className="max-w-6xl mx-auto px-4 py-6">
        <SearchBar
          query={searchQuery}
          darkMode={darkMode}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        {!searchQuery && (
          <CategoryTabs
            categories={symbolCategories}
            activeId={activeCategory}
            darkMode={darkMode}
            onSelect={setActiveCategory}
          />
        )}

        {!searchQuery && activeCategory === "quick" && (
          <RecentlyUsed
            symbols={recentlyUsed}
            darkMode={darkMode}
            onSelect={handleSymbolSelect}
          />
        )}

        {displaySymbols.length > 0 ? (
          <SymbolGrid
            symbols={displaySymbols}
            gridSize={gridSize}
            darkMode={darkMode}
            highContrast={highContrast}
            isFavorite={isFavorite}
            onSelect={handleSymbolSelect}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <div
            className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>ບໍ່ພົບສັນຍາລັກ</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AACApp;
