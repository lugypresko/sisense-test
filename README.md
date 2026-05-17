# F1 Pit Wall Insights with Sisense

Vibe coding makes it easy to generate dashboards. Serious analytics needs structure, trust, and context.

This Python-first prototype turns Formula 1 lap data into a local pit-wall decision dashboard: where VER created the gap over PER, when it opened, and how tyre behavior influenced the race story. It runs from committed processed data, so it does not require FastF1, a Sisense trial, a Sisense API token, or an MCP server to start.

## What It Does

- Loads Bahrain GP 2024 Race sample data for `VER` vs `PER`
- Shows where VER gained on PER across key laps
- Highlights when the delta opened and what the turning point was
- Surfaces tyre degradation context for decision timing
- Displays plain-English pit wall insights with evidence laps
- Keeps data access behind adapters so Sisense can be added later

## Local Demo Path

```bash
cd app
pip install -r requirements.txt
streamlit run streamlit_app.py
```

The app reads from:

```text
data/processed/laps.csv
data/processed/driver_delta.csv
data/processed/stints.csv
data/processed/insights.json
```

## Regenerate Processed Data

FastF1 is optional. The committed data is enough to run the demo.

```bash
pip install -r etl/requirements.txt
python etl/extract_fastf1_data.py --year 2024 --race Bahrain --session R --drivers VER PER
python etl/transform_insights.py --driver-a VER --driver-b PER
```

## Optional Sisense Compose SDK Path

This Streamlit app is the local Python demo path. The future embedded product path would use Sisense Compose SDK in a frontend application.

Day 1 scaffold for that path now exists under `frontend/` with a `dataMode` switch.

Run frontend local mode:

```bash
cd frontend
npm install
npm run dev
```

Environment:

```text
VITE_DATA_MODE=local|sisense
VITE_SISENSE_BASE_URL=
VITE_SISENSE_DATASOURCE=
VITE_SISENSE_AUTH_MODE=token
```

Notes:
- `local` mode is fully runnable now and uses committed processed data.
- `sisense` mode is a scaffold and intentionally throws until Compose SDK queries are implemented in `frontend/src/data/sisenseAdapter.ts`.

Recommended migration:

1. Upload `laps.csv`, `driver_delta.csv`, and `stints.csv` to a Sisense trial.
2. Build a simple Sisense data model for the processed tables.
3. Replace local Plotly chart components with Compose SDK charts.
4. Keep the same analytics contract: lap trend, driver delta, tyre degradation, KPI cards, and insight panel.

The current architecture prepares for that with:

```text
app/data_adapters/local_data_adapter.py   # active local adapter
app/data_adapters/sisense_adapter.py      # documented future stub
frontend/src/data/createAdapter.ts        # local|sisense switch
frontend/src/data/sisenseAdapter.ts       # frontend Sisense scaffold
```

## Optional Sisense MCP Server Path

The Sisense MCP Server can help developers inspect Sisense data sources and generate chart/query definitions, but it requires a Sisense instance and API token.

Reference: https://github.com/sisense/sisense-mcp-server

Suggested future workflow:

1. Configure the MCP server with Sisense URL and API token.
2. Ask what data sources and fields exist.
3. Generate candidate chart definitions for lap trend, delta, and tyre degradation.
4. Port those definitions into the Compose SDK implementation.

## Manual Screenshot

To capture the dashboard screenshot:

1. Run the app:

```bash
streamlit run app/streamlit_app.py
```

2. Open:

```text
http://localhost:8501
```

3. Capture a screenshot and save it as:

```text
docs/screenshots/dashboard.png
```

Note: Automated screenshot capture was not included because headless browser execution may be blocked in some local or sandboxed environments.

## Known Limitations

The demo runs locally by design; Sisense integration is documented as the next adapter path to avoid making credentials/setup a blocker.

## Project Structure

```text
app/
  streamlit_app.py
  components/
  data_adapters/
frontend/
  src/
  public/data/processed/
etl/
  extract_fastf1_data.py
  transform_insights.py
data/processed/
tests/
prompts/
```

## Story

Formula 1 fans do not need more charts. They need to understand where the race was won or lost.

The chart is not the product. The insight experience is the product.
