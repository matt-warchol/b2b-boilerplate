"use client";

import { useState, useSyncExternalStore } from "react";

const savedCache = new Map<string, { raw: string | null; value: unknown }>();
const subscribers = new Set<() => void>();
function subscribe(listener: () => void) {
  subscribers.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    subscribers.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
export function useSaved<T>(
  key: string,
  seed: T,
): [T, (value: T) => void, string] {
  const [error, setError] = useState("");
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        const raw = localStorage.getItem(key);
        const cached = savedCache.get(key);
        if (cached && cached.raw === raw) return cached.value as T;
        const parsed = raw ? JSON.parse(raw) : seed;
        const valid = Array.isArray(seed)
          ? Array.isArray(parsed) &&
            parsed.every(
              (item: unknown) =>
                typeof item === "object" &&
                item !== null &&
                Object.entries(seed[0] ?? {}).every(
                  ([field, example]) =>
                    typeof (item as Record<string, unknown>)[field] ===
                    typeof example,
                ),
            )
          : parsed && typeof parsed === "object" && !Array.isArray(parsed);
        const result = valid ? (parsed as T) : seed;
        savedCache.set(key, { raw, value: result });
        return result;
      } catch {
        return seed;
      }
    },
    () => seed,
  );
  return [
    value,
    (next: T) => {
      try {
        const raw = JSON.stringify(next);
        localStorage.setItem(key, raw);
        savedCache.set(key, { raw, value: next });
        subscribers.forEach((listener) => listener());
      } catch {
        setError("Browser storage is unavailable. Changes could not be saved.");
      }
    },
    error,
  ];
}
