import type { DashboardAdapter, DashboardData } from "../types";

export class SisenseAdapter implements DashboardAdapter {
  async loadDashboardData(): Promise<DashboardData> {
    throw new Error(
      "Sisense adapter is a scaffold. Configure Compose SDK and model queries, then implement this method."
    );
  }
}
