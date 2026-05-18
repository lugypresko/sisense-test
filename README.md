# F1 Pit Wall

F1 Pit Wall is a Sisense Compose SDK starter kit showing how AI-native builders can turn telemetry data into an embedded analytics experience.

## Why this matters

Vibe coding can generate dashboards fast, but serious analytics needs a reusable, embedded, governed analytics layer.

## Build and Tell Narrative

Local dashboard equals fast prototype.
Compose SDK equals the embedded analytics layer inside a real product.

## Run the app

```bash
cd frontend
npm install
npm run dev
```

## Analytics Modes

Use `.env.local` in `frontend/`.

### Local Mode (default)

```env
VITE_ANALYTICS_PROVIDER=local
```

Local mode reads committed processed data from:

```text
frontend/public/data/processed/
```

### Sisense Mode

```env
VITE_ANALYTICS_PROVIDER=sisense
VITE_SISENSE_URL=https://your-sisense-instance
VITE_SISENSE_TOKEN=your-api-token
VITE_SISENSE_DATASOURCE=F1_Pit_Wall
```

Sisense mode behavior:
- Uses a real `SisenseContextProvider` boundary.
- Renders a Compose SDK proof component (`SisenseLapTimeChart`).
- Fails gracefully if env vars are missing.
- Keeps local fallback data loading so the app still runs.

If config is missing, the app shows:
`Sisense Mode requires VITE_SISENSE_URL, VITE_SISENSE_TOKEN, and VITE_SISENSE_DATASOURCE. Switch to Local Mode or configure Sisense.`

## Configure Sisense (manual path)

1. Create Sisense Trial.
2. Upload processed F1 CSV data.
3. Create or identify data source name.
4. Get API token.
5. Generate data model:

```bash
npx @sisense/sdk-cli get-data-model \
  --url <SISENSE_URL> \
  --token <SISENSE_TOKEN> \
  --dataSource "<DATA_SOURCE_NAME>" \
  --output src/sisense/f1-data-model.ts
```

6. Set `.env.local` values and restart `npm run dev`.

## Where Compose SDK fits

The local data path exists so builders can clone and run immediately.
The Sisense path shows how the same experience becomes product-grade embedded analytics.

## Structure

```text
frontend/
  src/analytics/providers/
  src/components/sisense/
  src/sisense/f1-data-model.ts
strategy/strategy-brief.md
content/linkedin-post.md
prompts/
```

