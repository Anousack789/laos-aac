"use client";
import {
  Heart,
  Home,
  Maximize2,
  MessageCircle,
  Moon,
  Play,
  Plus,
  Search,
  Settings,
  Sun,
  Trash2,
  Type,
  Volume2,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Symbol, symbolCategories } from "../data/symbols";

type GridSize = 2 | 3 | 4;

interface SentenceItem extends Symbol {
  uniqueId?: string; // For tracking position in sentence
}

const AACApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("quick");
  const [sentence, setSentence] = useState<SentenceItem[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<Symbol[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<Symbol[]>([]);
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>("");
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null,
  );

  // Get audio file path for a symbol
  const getAudioPath = (symbolId: string): string => {
    return `/audio/${symbolId}.mp3`;
  };

  // Text-to-speech function using audio assets
  const speak = (text: string, symbolId?: string): void => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // If we have a symbol ID, play the corresponding audio file
    if (symbolId) {
      const audioPath = getAudioPath(symbolId);
      const audio = new Audio(audioPath);
      setCurrentAudio(audio);

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
      };
      audio.onerror = () => {
        console.error(`Failed to play audio: ${audioPath}`);
        setIsSpeaking(false);
        setCurrentAudio(null);
        // Fallback to speechSynthesis if audio file fails
        fallbackSpeak(text);
      };

      audio.play().catch((err) => {
        console.error("Audio playback error:", err);
        setIsSpeaking(false);
        setCurrentAudio(null);
        fallbackSpeak(text);
      });
    } else {
      // For custom text without symbol ID, use speechSynthesis fallback
      fallbackSpeak(text);
    }
  };

  // Fallback to speechSynthesis for custom text or when audio fails
  const fallbackSpeak = (text: string): void => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "lo-LA"; // Added Lao language support request
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const addToSentence = (symbol: Symbol): void => {
    const sentenceItem: SentenceItem = {
      ...symbol,
      uniqueId: `${symbol.id}-${Date.now()}`,
    };
    const newSentence = [...sentence, sentenceItem];
    setSentence(newSentence);

    setRecentlyUsed((prev) => {
      const filtered = prev.filter((s) => s.id !== symbol.id);
      return [symbol, ...filtered].slice(0, 8);
    });

    speak(symbol.text, symbol.id);
  };

  const removeFromSentence = (index: number): void => {
    const newSentence = sentence.filter((_, i) => i !== index);
    setSentence(newSentence);
  };

  const clearSentence = (): void => {
    setSentence([]);
    // Stop any playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsSpeaking(false);
  };

  const speakSentence = (): void => {
    if (sentence.length > 0) {
      // Play audio files sequentially for each symbol in the sentence
      let currentIndex = 0;

      const playNext = () => {
        if (currentIndex >= sentence.length) {
          setIsSpeaking(false);
          return;
        }

        const symbol = sentence[currentIndex];
        const audioPath = getAudioPath(symbol.id);
        const audio = new Audio(audioPath);
        setCurrentAudio(audio);

        audio.onended = () => {
          currentIndex++;
          playNext();
        };

        audio.onerror = () => {
          console.error(`Failed to play audio: ${audioPath}`);
          currentIndex++;
          playNext();
        };

        audio.play().catch((err) => {
          console.error("Audio playback error:", err);
          currentIndex++;
          playNext();
        });
      };

      setIsSpeaking(true);
      playNext();
    }
  };

  const toggleFavorite = (symbol: Symbol): void => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === symbol.id);
      if (exists) {
        return prev.filter((f) => f.id !== symbol.id);
      }
      return [...prev, symbol];
    });
  };

  const handleCustomTextSubmit = (): void => {
    if (customText.trim()) {
      const customSymbol: Symbol = {
        id: `custom-${Date.now()}`,
        text: customText.trim(),
        img: "💬",
        color: "bg-gray-100",
        isCustom: true,
      };
      addToSentence(customSymbol);
      setCustomText("");
      setShowTextInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleCustomTextSubmit();
    }
  };

  // Get current category symbols
  const currentCategory = symbolCategories.find((c) => c.id === activeCategory);

  const displaySymbols: Symbol[] = searchQuery
    ? symbolCategories
        .flatMap((c) => c.symbols)
        .filter((s) => s.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentCategory?.symbols || [];

  // Grid column classes based on gridSize
  const gridCols: Record<GridSize, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const isSymbolFavorite = (symbol: Symbol): boolean => {
    return favorites.some((f) => f.id === symbol.id);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-linear-to-br from-blue-50 to-indigo-100"}`}
    >
      {/* Header / Sentence Builder */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900/90 border-gray-700"
            : "bg-white/80 border-white/50"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="text-white w-6 h-6" />
              </div>
              <div>
                <h1
                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  SpeakEasy AAC
                </h1>
                <p
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  ແອັບຊ່ວຍການສື່ສານ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all ${darkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"}`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-all ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"}`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sentence Display */}
          <div
            className={`rounded-2xl p-4 min-h-25 transition-colors relative ${
              darkMode
                ? "bg-gray-800 border-2 border-gray-700"
                : "bg-white border-2 border-blue-100 shadow-inner"
            }`}
          >
            {sentence.length === 0 ? (
              <div
                className={`text-center py-4 ${darkMode ? "text-gray-500" : "text-gray-400"} italic`}
              >
                ແຕະສັນຍາລັກເພື່ອສ້າງຂໍ້ຄວາມ...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 items-center">
                {sentence.map((symbol, index) => (
                  <div
                    key={symbol.uniqueId || `${symbol.id}-${index}`}
                    onClick={() => removeFromSentence(index)}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600"
                        : "bg-white border-2 border-blue-200 shadow-sm"
                    }`}
                  >
                    <span className="text-2xl">{symbol.img}</span>
                    <span
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {symbol.text}
                    </span>
                    <X
                      className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? "text-gray-400" : "text-gray-400"}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              {sentence.length > 0 && (
                <>
                  <button
                    onClick={clearSentence}
                    className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shadow-sm"
                    title="ລຶບທັງໝົດ"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={speakSentence}
                    disabled={isSpeaking}
                    className={`p-3 rounded-full transition-all shadow-lg transform hover:scale-105 ${
                      isSpeaking
                        ? "bg-green-500 text-white animate-pulse"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    title="ອ່ານຂໍ້ຄວາມ"
                  >
                    {isSpeaking ? (
                      <Volume2 className="w-6 h-6 animate-bounce" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div
          className={`border-b transition-colors ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  ຂະໜາດຕາຕະລາງ:
                </span>
                <div className="flex gap-2">
                  {([2, 3, 4] as GridSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        gridSize === size
                          ? "bg-blue-500 text-white shadow-md"
                          : darkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {size} × {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    highContrast
                      ? "bg-purple-500 text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                  ສີຊັດເຈນ (High Contrast)
                </button>

                <button
                  onClick={() => setShowTextInput(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-all shadow-md"
                >
                  <Type className="w-4 h-4" />
                  ພິມຂໍ້ຄວາມ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text Input Modal */}
      {showTextInput && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className={`rounded-2xl p-6 w-full max-w-md shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <h3
              className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              ພິມຂໍ້ຄວາມຂອງທ່ານ
            </h3>
            <input
              type="text"
              value={customText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCustomText(e.target.value)
              }
              onKeyPress={handleKeyPress}
              placeholder="ປ້ອນຂໍ້ຄວາມເພື່ອໃຫ້ອ່ານ..."
              className={`w-full px-4 py-3 rounded-xl border-2 mb-4 outline-none transition-all ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500"
              }`}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowTextInput(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={handleCustomTextSubmit}
                className="px-6 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
              >
                ເພີ່ມໃສ່ຂໍ້ຄວາມ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            placeholder="ຊອກຫາສັນຍາລັກ..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
                : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 shadow-sm"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {symbolCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
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
        )}

        {/* Recently Used Section (when not searching) */}
        {!searchQuery &&
          recentlyUsed.length > 0 &&
          activeCategory === "quick" && (
            <div className="mb-8">
              <h3
                className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                ໃຊ້ຫຼ້າສຸດ
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recentlyUsed.map((symbol, idx) => (
                  <button
                    key={`recent-${symbol.id}-${idx}`}
                    onClick={() => addToSentence(symbol)}
                    className={`shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 shadow-sm ${
                      darkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <span className="text-2xl">{symbol.img}</span>
                    <span
                      className={`text-xs font-medium truncate w-full px-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {symbol.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Symbols Grid */}
        <div className={`grid ${gridCols[gridSize]} gap-3 md:gap-4`}>
          {displaySymbols.map((symbol) => (
            <button
              key={symbol.id}
              onClick={() => addToSentence(symbol)}
              className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-xl ${
                highContrast ? "bg-white border-4 border-black" : symbol.color
              } ${darkMode && !highContrast ? "brightness-90" : ""}`}
            >
              <span
                className={`text-4xl md:text-5xl transition-transform group-hover:scale-110 ${highContrast ? "grayscale" : ""}`}
              >
                {symbol.img}
              </span>
              <span
                className={`text-sm md:text-base font-bold text-center px-2 leading-tight ${
                  highContrast ? "text-black text-lg" : "text-gray-800"
                }`}
              >
                {symbol.text}
              </span>

              {/* Favorite Button */}
              <div
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  toggleFavorite(symbol);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart
                  className={`w-5 h-5 ${isSymbolFavorite(symbol) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {displaySymbols.length === 0 && (
          <div
            className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>ບໍ່ພົບສັນຍາລັກ</p>
          </div>
        )}
      </main>

      {/* Quick Actions Footer */}
      <footer
        className={`fixed bottom-0 left-0 right-0 border-t backdrop-blur-md transition-colors ${
          darkMode
            ? "bg-gray-900/90 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-around items-center">
          <button
            onClick={() => setActiveCategory("quick")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeCategory === "quick"
                ? "text-blue-500"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-600"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">ໜ້າຫຼັກ</span>
          </button>

          <button
            onClick={() => setShowTextInput(true)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg -mt-8 border-4 border-white dark:border-gray-900">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs">ພິມຂໍ້ຄວາມ</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              showSettings
                ? "text-blue-500"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-600"
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">ຕັ້ງຄ່າ</span>
          </button>
        </div>
      </footer>

      {/* Bottom padding for fixed footer */}
      <div className="h-24" />
    </div>
  );
};

export default AACApp;
