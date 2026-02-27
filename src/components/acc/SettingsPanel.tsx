"use client";
import { Maximize2, Type } from "lucide-react";
import React from "react";
import { FontSize, fontSizeConfig, GridSize } from "@/hooks/useSettings";

interface SettingsPanelProps {
  darkMode: boolean;
  gridSize: GridSize;
  highContrast: boolean;
  fontSize: FontSize;
  onGridSizeChange: (size: GridSize) => void;
  onToggleHighContrast: () => void;
  onFontSizeChange: (size: FontSize) => void;
  onOpenTextInput: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  darkMode, gridSize, highContrast, fontSize,
  onGridSizeChange, onToggleHighContrast, onFontSizeChange, onOpenTextInput,
}) => {
  const base = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const label = darkMode ? "text-gray-300" : "text-gray-600";
  const inactive = darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div className={`border-b transition-colors ${base}`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">

        {/* Row 1: Grid size + High contrast + Text input */}
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${label}`}>ຂະໜາດຕາຕະລາງ:</span>
            <div className="flex gap-2">
              {([2, 3, 4] as GridSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => onGridSizeChange(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    gridSize === size ? "bg-blue-500 text-white shadow-md" : inactive
                  }`}
                >
                  {size} × {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleHighContrast}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                highContrast ? "bg-purple-500 text-white" : inactive
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              ສີຊັດເຈນ (High Contrast)
            </button>

            <button
              onClick={onOpenTextInput}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-all shadow-md"
            >
              <Type className="w-4 h-4" />
              ພິມຂໍ້ຄວາມ
            </button>
          </div>
        </div>

        {/* Row 2: Font size */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`text-sm font-medium ${label}`}>ຂະໜາດຕົວອັກສອນ:</span>
          <div className="flex gap-2">
            {(["normal", "large", "elder"] as FontSize[]).map((size) => {
              const cfg = fontSizeConfig[size];
              const isActive = fontSize === size;
              const elderStyle = size === "elder" && isActive
                ? "bg-orange-500 text-white shadow-md"
                : size === "elder"
                ? `${inactive} border-2 border-orange-300`
                : isActive
                ? "bg-blue-500 text-white shadow-md"
                : inactive;

              return (
                <button
                  key={size}
                  onClick={() => onFontSizeChange(size)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${elderStyle} ${cfg.ui}`}
                >
                  {size === "elder" ? `👴 ${cfg.label}` : cfg.label}
                </button>
              );
            })}
          </div>

          {/* Live preview */}
          <span className={`ml-2 ${label} ${fontSizeConfig[fontSize].symbolText} opacity-60 transition-all`}>
            ກ ຂ ຄ
          </span>
        </div>

      </div>
    </div>
  );
};