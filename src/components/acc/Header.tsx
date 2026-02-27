"use client";
import { SentenceItem } from "@/hooks/useSentence";
import { Moon, Play, Settings, Sun, Trash2, Volume2, X } from "lucide-react";
import Image from 'next/image';
import React from "react";

interface HeaderProps {
  sentence: SentenceItem[];
  isSpeaking: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSettings: () => void;
  onRemoveItem: (index: number) => void;
  onClear: () => void;
  onSpeak: () => void;
}


export const Header: React.FC<HeaderProps> = ({
  sentence, isSpeaking, darkMode,
  onToggleDarkMode, onToggleSettings, onRemoveItem, onClear, onSpeak,
}) => (
  <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
    darkMode ? "bg-gray-900/90 border-gray-700" : "bg-white/80 border-white/50"
  }`}>
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-transparent">
            <Image src={'/logo.png'} alt="logo" width={100} height={100} className="w-full h-full bg-transparent"/>
          </div>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              SpeakEasy AAC
            </h1>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              ແອັບຊ່ວຍການສື່ສານ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleDarkMode} className={`p-2 rounded-lg transition-all ${darkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"}`}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={onToggleSettings} className={`p-2 rounded-lg transition-all ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"}`}>
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`rounded-2xl p-4 min-h-25 transition-colors relative ${
        darkMode ? "bg-gray-800 border-2 border-gray-700" : "bg-white border-2 border-blue-100 shadow-inner"
      }`}>
        {sentence.length === 0 ? (
          <div className={`aac-sentence-text text-center py-4 italic ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            ແຕະສັນຍາລັກເພື່ອສ້າງຂໍ້ຄວາມ...
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            {sentence.map((symbol, index) => (
              <div
                key={symbol.uniqueId}
                onClick={() => onRemoveItem(index)}
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                  darkMode ? "bg-gray-700 border border-gray-600" : "bg-white border-2 border-blue-200 shadow-sm"
                }`}
              >
                <span className="aac-symbol-emoji">{symbol.img}</span>
                <span className={`aac-sentence-text font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {symbol.text}
                </span>
                <X className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
              </div>
            ))}
          </div>
        )}

        {sentence.length > 0 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button onClick={onClear} className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shadow-sm" title="ລຶບທັງໝົດ">
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onSpeak}
              disabled={isSpeaking}
              className={`p-3 rounded-full transition-all shadow-lg transform hover:scale-105 ${isSpeaking ? "bg-green-500 text-white animate-pulse" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              title="ອ່ານຂໍ້ຄວາມ"
            >
              {isSpeaking ? <Volume2 className="w-6 h-6 animate-bounce" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
);