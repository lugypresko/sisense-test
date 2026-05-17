import type { DashboardAdapter, DashboardData, Kpis } from "../types";

async function loadCsv(path: string): Promise<Array<Record<string, string>>> {
  const response = await fetch(path);
  const text = await response.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });
    return row;
  });
}

function toNumber(value: string): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function calculateKpis(
  laps: Array<Record<string, string>>,
  delta: Array<Record<string, string>>,
  stints: Array<Record<string, string>>
): Kpis {
  const fastest = laps.reduce((best, current) =>
    toNumber(current.lap_time) < toNumber(best.lap_time) ? current : best
  );
  const avgGap =
    delta.reduce((sum, row) => sum + Math.abs(toNumber(row.delta_seconds)), 0) /
    Math.max(delta.length, 1);
  const turningPoint = delta.reduce((best, current, idx) => {
    if (idx === 0) return best;
    const currentShift = Math.abs(toNumber(current.delta_seconds) - toNumber(delta[idx - 1].delta_seconds));
    return currentShift > best.shift
      ? { shift: currentShift, lap: Number(current.lap) }
      : best;
  }, { shift: 0, lap: Number(delta[0]?.lap ?? 0) });
  const maxDrop = stints.reduce((best, current) => Math.max(best, toNumber(current.drop_seconds)), 0);

  return {
    selectedRace: "Bahrain GP 2024",
    selectedDrivers: "VER vs PER",
    fastestLap: {
      driver: String(fastest.driver),
      lap: Number(fastest.lap),
      seconds: toNumber(fastest.lap_time)
    },
    averageGapSeconds: avgGap,
    turningPointLap: turningPoint.lap,
    stintDropSeconds: maxDrop
  };
}

export class LocalAdapter implements DashboardAdapter {
  async loadDashboardData(): Promise<DashboardData> {
    const [laps, driverDelta, stints, insights] = await Promise.all([
      loadCsv("/data/processed/laps.csv"),
      loadCsv("/data/processed/driver_delta.csv"),
      loadCsv("/data/processed/stints.csv"),
      fetch("/data/processed/insights.json").then((r) => r.json())
    ]);

    return {
      laps,
      driverDelta,
      stints,
      insights,
      kpis: calculateKpis(laps, driverDelta, stints)
    };
  }
}
