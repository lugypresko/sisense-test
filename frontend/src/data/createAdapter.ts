import { LocalAdapter } from "./localAdapter";
import { SisenseAdapter } from "./sisenseAdapter";
import type { DashboardAdapter } from "../types";

export function createAdapter(): DashboardAdapter {
  const mode = (import.meta.env.VITE_DATA_MODE ?? "local").toLowerCase();
  if (mode === "sisense") {
    return new SisenseAdapter();
  }
  return new LocalAdapter();
}
