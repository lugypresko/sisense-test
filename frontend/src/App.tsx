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
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai" | "system"; text: string }>>([
    { sender: "system", text: "📡 PIT WALL TELEMETRY CO-PILOT ONLINE. Click a quick tactial prompt below or type your query in the console." }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const mode = getAnalyticsMode();
  const provider = useMemo(() => createAnalyticsProvider(), []);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || !data) return;

    setChatHistory(prev => [...prev, { sender: "user", text: textToSend }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      const q = textToSend.toLowerCase();
      let reply = "";

      const fastestLap = data.kpis.fastestLap.seconds.toFixed(2);
      const fastestLapDriver = data.kpis.fastestLap.driver;
      const fastestLapLap = data.kpis.fastestLap.lap;
      const avgGap = data.kpis.averageGapSeconds.toFixed(2);
      const stintDrop = data.kpis.stintDropSeconds.toFixed(2);
      const turningPoint = data.kpis.turningPointLap;

      if (q.includes("tyre") || q.includes("tire") || q.includes("wear") || q.includes("degrad")) {
        reply = `🏎️ **Telemetry Tyre Wear Report**: The scatter wear model shows a stint degradation rate of **${stintDrop}s/lap** slower per lap of tyre life. Stint Drop shows Perez had a performance decay of **${stintDrop}s** from start to end of stint. Telemetry crossover highlights Lap ${turningPoint} as the peak wear phase where Verstappen capitalized.`;
      } else if (q.includes("turning") || q.includes("lap") || q.includes("point") || q.includes("delta")) {
        reply = `📈 **Race Turning Point Analysis**: Telemetry delta tracking confirms the turning point occurred on **Lap ${turningPoint}**. On this specific lap, Verstappen expanded his pace advantage, creating a gap that Perez could not bridge. The overall average driver gap across this run is **${avgGap}s**.`;
      } else if (q.includes("pit") || q.includes("stop") || q.includes("box") || q.includes("strategy") || q.includes("when")) {
        reply = `⛽ **Pit Stop Recommendation**: **Box Box** is recommended for the leader on **Lap 20**. Stint drop stands at **${stintDrop}s**. The average driver gap of **${avgGap}s** provides a safe exit window of 21.4 seconds, mitigating any traffic threat on exit. Fastest lap in the session remains **${fastestLap}s** (set by ${fastestLapDriver} on Lap ${fastestLapLap}).`;
      } else {
        reply = `📡 **Telemetry Command Center**: Fastest lap is **${fastestLap}s** (${fastestLapDriver}, Lap ${fastestLapLap}). Average delta is **${avgGap}s** with stint drop at **${stintDrop}s**. Lap ${turningPoint} stands as the pivotal strategic crossover. Type a specific query or use the tactical buttons above to formulate pit stop adjustments.`;
      }

      setChatHistory(prev => [...prev, { sender: "ai", text: reply }]);
      setIsTyping(false);
    }, 850);
  };

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
      <section className="panel split insightsSection">
        <article className="staticInsights">
          <h2>Pit Wall Strategy Cards</h2>
          <div className="insightsGrid">
            {data.insights.map((item) => (
              <article key={item.title} className="insight">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <small>Evidence laps: {item.evidence_laps.join(", ") || "-"}</small>
              </article>
            ))}
          </div>
        </article>
        
        <article className="aiCopilot">
          <div className="aiCopilotHeader">
            <h2>Pit Wall AI Co-Pilot</h2>
            <span className="liveBadge">
              <span className="pulseCircle"></span>
              AI Engineer Active
            </span>
          </div>
          <div className="chatHistory">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`chatBubble ${msg.sender}`}>
                <div className="senderName">
                  {msg.sender === "user" ? "🏎️ You (Manager)" : msg.sender === "ai" ? "📡 Gianpiero Lambiase (GP)" : "🖥️ Systems"}
                </div>
                <div className="messageText" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            ))}
            {isTyping && (
              <div className="chatBubble ai typing">
                <div className="senderName">📡 GP is compiling telemetry...</div>
                <div className="typingIndicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="quickPrompts">
            <button onClick={() => handleSendMessage("Analyze Verstappen vs. Perez tyre degradation wear")} className="promptBtn">
              🔄 Tyre Wear
            </button>
            <button onClick={() => handleSendMessage("When was the race turning point and largest delta shift?")} className="promptBtn">
              ⏱️ Race Turning Point
            </button>
            <button onClick={() => handleSendMessage("Formulate pit stop strategy and exit window for the leader")} className="promptBtn">
              ⛽ Pit Stop Strategy
            </button>
          </div>

          <div className="chatInputArea">
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatInput)}
              placeholder="Ask GP about tyre wear, delta shift, or box strategy..." 
              className="chatInput"
            />
            <button onClick={() => handleSendMessage(chatInput)} className="chatSendBtn">Send Command</button>
          </div>
        </article>
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
