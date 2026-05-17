export type Insight = {
  title: string;
  summary: string;
  evidence_laps: number[];
  why_it_matters?: string;
};

export type Kpis = {
  selectedRace: string;
  selectedDrivers: string;
  fastestLap: { driver: string; lap: number; seconds: number };
  averageGapSeconds: number;
  turningPointLap: number;
  stintDropSeconds: number;
};

export type DashboardData = {
  laps: Array<Record<string, string | number>>;
  driverDelta: Array<Record<string, string | number>>;
  stints: Array<Record<string, string | number>>;
  insights: Insight[];
  kpis: Kpis;
};

export interface DashboardAdapter {
  loadDashboardData(): Promise<DashboardData>;
}
