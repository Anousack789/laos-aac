"use client";
import React, { useState } from "react";

interface TextInputModalProps {
  darkMode: boolean;
  onSubmit: (text: string) => void;
  onClose: () => void;
}

export const TextInputModal: React.FC<TextInputModalProps> = ({ darkMode, onSubmit, onClose }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl p-6 w-full max-w-md shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
          ພິມຂໍ້ຄວາມຂອງທ່ານ
        </h3>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="ປ້ອນຂໍ້ຄວາມເພື່ອໃຫ້ອ່ານ..."
          autoFocus
          className={`w-full px-4 py-3 rounded-xl border-2 mb-4 outline-none transition-all ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              : "bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500"
          }`}
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            ຍົກເລີກ
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
          >
            ເພີ່ມໃສ່ຂໍ້ຄວາມ
          </button>
        </div>
      </div>
    </div>
  );
};