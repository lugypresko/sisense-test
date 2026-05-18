import type { AnalyticsProvider } from "./AnalyticsProvider";
import { LocalAdapter } from "../../data/localAdapter";
import type { DashboardData } from "../../types";

export class LocalF1Provider implements AnalyticsProvider {
  mode: "local" = "local";
  private readonly adapter = new LocalAdapter();

  loadDashboardData(): Promise<DashboardData> {
    return this.adapter.loadDashboardData();
  }
}

