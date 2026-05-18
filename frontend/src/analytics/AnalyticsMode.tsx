import { LocalF1Provider } from "./providers/LocalF1Provider";
import {
  SisenseComposeProvider,
  SisenseModeBoundary,
  readSisenseConfig,
} from "./providers/SisenseComposeProvider";
import type { AnalyticsMode, AnalyticsProvider } from "./providers/AnalyticsProvider";

export function getAnalyticsMode(): AnalyticsMode {
  const value = (import.meta.env.VITE_ANALYTICS_PROVIDER ?? "local")
    .toString()
    .toLowerCase();
  return value === "sisense" ? "sisense" : "local";
}

export function createAnalyticsProvider(): AnalyticsProvider {
  return getAnalyticsMode() === "sisense"
    ? new SisenseComposeProvider()
    : new LocalF1Provider();
}

export { SisenseModeBoundary, readSisenseConfig };

