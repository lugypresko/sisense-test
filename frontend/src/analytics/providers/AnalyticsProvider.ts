import type { DashboardData } from "../../types";

export type AnalyticsMode = "local" | "sisense";

export interface AnalyticsProvider {
  mode: AnalyticsMode;
  loadDashboardData(): Promise<DashboardData>;
}

