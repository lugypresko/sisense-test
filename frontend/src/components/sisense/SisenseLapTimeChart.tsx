import { Chart } from "@sisense/sdk-ui";
import { measureFactory } from "@sisense/sdk-data";
import * as DM from "../../sisense/f1-data-model";
import { readSisenseConfig } from "../../analytics/AnalyticsMode";

const REQUIRED_MESSAGE =
  "Sisense Mode requires VITE_SISENSE_URL, VITE_SISENSE_TOKEN, and VITE_SISENSE_DATASOURCE. Switch to Local Mode or configure Sisense.";

export function SisenseLapTimeChart() {
  const config = readSisenseConfig();

  if (!config) {
    return (
      <div className="sisenseMissing">
        <p>{REQUIRED_MESSAGE}</p>
      </div>
    );
  }

  return (
    <Chart
      dataSet={DM.DataSource}
      chartType={"line"}
      dataOptions={{
        category: [DM.Laps.Lap as unknown as never],
        value: [measureFactory.average(DM.Laps.LapTime as unknown as never, "Avg Lap Time")],
        breakBy: [DM.Laps.Driver as unknown as never],
      }}
    />
  );
}

