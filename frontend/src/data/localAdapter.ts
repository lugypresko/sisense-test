import type { DashboardAdapter, DashboardData, Kpis } from "../types";
import Papa, { ParseResult } from "papaparse";

async function loadCsv(path: string): Promise<Array<Record<string, string>>> {
  const response = await fetch(path);
  const text = await response.text();
  const parsed: ParseResult<Record<string, string>> = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  });
  return (parsed.data ?? []).map((row: Record<string, string>) => {
    const normalized: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      normalized[key.trim()] = String(value ?? "").trim();
    });
    return normalized;
  });
}

function toNumber(value: unknown): number {
  const numeric = Number(String(value ?? "").trim());
  return Number.isFinite(numeric) ? numeric : 0;
}

function normalizeLapRow(row: Record<string, string>): Record<string, string> {
  return {
    ...row,
    lap: String(toNumber(row.lap ?? row.lap_number ?? "")),
    lap_time: String(toNumber(row.lap_time ?? row.lap_time_seconds ?? "")),
    tyre_life: String(toNumber(row.tyre_life ?? "")),
    tyre: row.tyre ?? row.compound ?? "",
  };
}

function normalizeDeltaRow(row: Record<string, string>): Record<string, string> {
  return {
    ...row,
    lap: String(toNumber(row.lap ?? row.lap_number ?? "")),
    delta_seconds: String(toNumber(row.delta_seconds ?? "")),
  };
}

function calculateKpis(
  laps: Array<Record<string, string>>,
  delta: Array<Record<string, string>>,
  stints: Array<Record<string, string>>
): Kpis {
  const lapRows = laps.filter((r) => Number.isFinite(toNumber(r.lap_time)));
  const fastest = lapRows.reduce((best, current) =>
    toNumber(current.lap_time) < toNumber(best.lap_time) ? current : best,
    lapRows[0]
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
    fastestLap: fastest
      ? {
          driver: String(fastest.driver ?? "N/A"),
          lap: Number(fastest.lap),
          seconds: toNumber(fastest.lap_time),
        }
      : { driver: "N/A", lap: 0, seconds: 0 },
    averageGapSeconds: avgGap,
    turningPointLap: turningPoint.lap,
    stintDropSeconds: maxDrop
  };
}

export class LocalAdapter implements DashboardAdapter {
  async loadDashboardData(): Promise<DashboardData> {
    const [rawLaps, rawDriverDelta, stints, insights] = await Promise.all([
      loadCsv("/data/processed/laps.csv"),
      loadCsv("/data/processed/driver_delta.csv"),
      loadCsv("/data/processed/stints.csv"),
      fetch("/data/processed/insights.json").then((r) => r.json())
    ]);
    const laps = rawLaps.map(normalizeLapRow);
    const driverDelta = rawDriverDelta.map(normalizeDeltaRow);

    return {
      laps,
      driverDelta,
      stints,
      insights,
      kpis: calculateKpis(laps, driverDelta, stints)
    };
  }
}
