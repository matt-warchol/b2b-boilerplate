"use client";

import { useSyncExternalStore } from "react";
import { sampleOpportunities, stages, type Opportunity } from "./model";

const key = "dealradar.starter.opportunities.v1";
let lastRaw: string | null = null;
let snapshot = sampleOpportunities;
let memoryOnly = false;
const listeners = new Set<() => void>();

function isOpportunity(value: unknown): value is Opportunity {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<keyof Opportunity, unknown>;
  return typeof row.id === "string" && typeof row.title === "string" && typeof row.buyer === "string"
    && typeof row.region === "string" && typeof row.nextStep === "string"
    && typeof row.deadline === "string" && (row.deadline === "" || (
      /^\d{4}-\d{2}-\d{2}$/.test(row.deadline) && Number.isFinite(Date.parse(row.deadline))
    )) && stages.some((stage) => stage === row.stage);
}

function getSnapshot() {
  if (memoryOnly) return snapshot;
  try {
    const raw = localStorage.getItem(key);
    if (raw === lastRaw) return snapshot;
    lastRaw = raw;
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    snapshot = Array.isArray(parsed) && parsed.every(isOpportunity) ? parsed : sampleOpportunities;
  } catch {
    snapshot = sampleOpportunities;
  }
  return snapshot;
}

function subscribe(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === key || event.key === null) listener();
  }
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useOpportunities() {
  return useSyncExternalStore(subscribe, getSnapshot, () => sampleOpportunities);
}

export function saveOpportunity(record: Opportunity) {
  const rows = getSnapshot();
  const updated = rows.some(({ id }) => id === record.id)
    ? rows.map((row) => row.id === record.id ? record : row)
    : [record, ...rows];
  snapshot = updated;
  try {
    const raw = JSON.stringify(updated);
    localStorage.setItem(key, raw);
    lastRaw = raw;
    memoryOnly = false;
  } catch {
    memoryOnly = true;
  }
  listeners.forEach((listener) => listener());
  return !memoryOnly;
}
