import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { createAnalyticsProvider, getAnalyticsMode, SisenseModeBoundary } from "./analytics/AnalyticsMode";
import { SisenseLapTimeChart } from "./components/sisense/SisenseLapTimeChart";
import type { DashboardData } from "./types";

function toNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>("");
  const mode = getAnalyticsMode();
  const provider = useMemo(() => createAnalyticsProvider(), []);

  useEffect(() => {
    provider
      .loadDashboardData()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, [provider]);

  if (error) return <main className="page"><p className="error">{error}</p></main>;
  if (!data) return <main className="page"><p>Loading dashboard...</p></main>;

  return (
    <main className="page">
      <header className="header">
        <h1>F1 Pit Wall Insights</h1>
        <p>Where VER created the gap over PER</p>
        <div className="modeBadges">
          <span className={mode === "local" ? "badge active" : "badge"}>
            Local Mode: FastF1 processed data to React charts
          </span>
          <span className={mode === "sisense" ? "badge active" : "badge"}>
            Sisense Mode: FastF1 CSV to Sisense model to Compose SDK
          </span>
        </div>
      </header>
      <section className="kpiGrid">
        <article className="kpi"><h2>Fastest Lap</h2><p>{data.kpis.fastestLap.seconds.toFixed(2)}s</p><small>{data.kpis.fastestLap.driver} lap {data.kpis.fastestLap.lap}</small></article>
        <article className="kpi"><h2>Avg Gap</h2><p>{data.kpis.averageGapSeconds.toFixed(2)}s</p><small>{data.kpis.selectedDrivers}</small></article>
        <article className="kpi"><h2>Stint Drop</h2><p>{data.kpis.stintDropSeconds.toFixed(2)}s</p><small>end vs start</small></article>
        <article className="kpi"><h2>Turning Point</h2><p>Lap {data.kpis.turningPointLap}</p><small>largest delta shift</small></article>
      </section>
      <section className="panel">
        <h2>Lap Time Trend</h2>
        <div className="chart">
          <ResponsiveContainer>
            <LineChart data={data.laps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lap" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lap_time" stroke="#00d2be" name="Lap Time" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="panel split">
        <article>
          <h2>Driver Delta</h2>
          <div className="chart">
            <ResponsiveContainer>
              <LineChart data={data.driverDelta}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lap" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="delta_seconds" stroke="#f9d923" name="Delta (s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article>
          <h2>Tyre Degradation</h2>
          <div className="chart">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid />
                <XAxis dataKey="tyre_life" name="Tyre Life" />
                <YAxis dataKey="lap_time" name="Lap Time" />
                <Tooltip />
                <Scatter data={data.laps.map((row) => ({ ...row, lap_time: toNum(row.lap_time), tyre_life: toNum(row.tyre_life) }))} fill="#ff5a5f" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
      <section className="panel">
        <h2>Pit Wall Insights</h2>
        <div className="insights">
          {data.insights.map((item) => (
            <article key={item.title} className="insight">
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <small>Evidence laps: {item.evidence_laps.join(", ") || "-"}</small>
            </article>
          ))}
        </div>
      </section>
      {mode === "sisense" && (
        <section className="panel">
          <h2>Sisense Compose Proof Point</h2>
          <SisenseModeBoundary>
            <div className="chart">
              <SisenseLapTimeChart />
            </div>
          </SisenseModeBoundary>
        </section>
      )}
    </main>
  );
}
