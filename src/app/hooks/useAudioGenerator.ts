"use client";

import { useCallback, useState } from "react";

interface UseAudioGeneratorReturn {
  generate: (id: string, text: string) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

export function useAudioGenerator(): UseAudioGeneratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (id: string, text: string): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, text }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate audio");
        }

        return data.url;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { generate, isLoading, error };
}
