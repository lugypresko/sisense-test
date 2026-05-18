// Placeholder model file for Compose SDK.
// Generate a real model with:
// npx @sisense/sdk-cli get-data-model \
//   --url <SISENSE_URL> \
//   --token <SISENSE_TOKEN> \
//   --dataSource "<DATA_SOURCE_NAME>" \
//   --output src/sisense/f1-data-model.ts

export const DataSource = "F1_Pit_Wall";

export const Laps = {
  Lap: "lap",
  LapTime: "lap_time",
  Driver: "driver",
  Tyre: "tyre",
};

