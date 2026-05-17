# Python Streamlit F1 Demo Implementation Plan

**Goal:** Build a local-first Python F1 analytics demo that runs from committed processed data and documents optional Sisense integration paths.

**Demo Narrative:** From raw F1 telemetry to a pit-wall decision dashboard builders can run locally and later connect to Sisense.

**Architecture:** The demo uses Streamlit, Pandas, and Plotly against local CSV/JSON files. Data access is isolated behind adapters so `local_data_adapter.py` is active now and `sisense_adapter.py` can later connect to a Sisense instance or frontend Compose SDK path.

**Tech Stack:** Python, Streamlit, Pandas, Plotly, Pytest, optional FastF1.

---

### Definition of Done

Project is considered complete when all of the following are true:
- `streamlit run app/streamlit_app.py` starts the local dashboard successfully.
- Processed sample data is committed in `data/processed/`.
- `README.md` is complete and documents local run plus optional Sisense paths.
- Tests pass (`python -m pytest`).
- Demo runtime has no hard dependency on Sisense, API token, or FastF1.

---

### Minimal Data Schema

Required columns for local demo contract:
- `laps.csv`: `driver`, `lap`, `lap_time`, `tyre`, `stint`
- `driver_delta.csv`: `lap`, `delta_seconds`
- `stints.csv`: `driver`, `stint`, `compound`, `start_lap`, `end_lap`
- `insights.json`: `title`, `summary`, `evidence_laps`

Implementation note:
- Existing files may carry additional columns for analytics and visualization.
- Adapter layer should normalize file field names where needed.

---

### Task 0: Repo Setup

**Files:**
- Create: `.gitignore`
- Create: `requirements-dev.txt` or `pyproject.toml`
- Confirm folder structure under `app/`, `etl/`, `data/processed/`, `tests/`, `prompts/`
- Confirm basic run commands in `README.md`

Set non-ambiguous local setup so Codex/Claude does not guess environment details.

### Task 1: Data Contract + Adapter Tests

**Files:**
- Create or update: `tests/test_local_data_adapter.py`
- Create or update: `tests/test_insight_logic.py`
- Create or update: `pytest.ini`

Define the expected processed files and behavior:
- Local adapter loads laps, driver delta, stints, and insights.
- KPI calculations return fastest lap, average gap, stint drop, and turning point.
- Insight generation works from sample lap/delta data.
- Do not add UI or Streamlit rendering tests.

### Task 2: Committed Sample Data + Optional FastF1 ETL

**Files:**
- Create: `data/processed/laps.csv`
- Create: `data/processed/driver_delta.csv`
- Create: `data/processed/stints.csv`
- Create: `data/processed/insights.json`
- Create or update: `etl/extract_fastf1_data.py`
- Create or update: `etl/transform_insights.py`
- Create or update: `etl/requirements.txt`

Commit sample Bahrain 2024 VER vs PER processed data so the app works without external setup. Add FastF1 scripts for regeneration.

### Task 3: Streamlit Dashboard

**Files:**
- Create: `app/streamlit_app.py`
- Create: `app/data_adapters/local_data_adapter.py`
- Create: `app/data_adapters/sisense_adapter.py`
- Create: `app/components/kpi_cards.py`
- Create: `app/components/charts.py`
- Create: `app/components/pit_wall_insights.py`
- Create or update: `app/requirements.txt`

Build a pit-wall story dashboard that answers:
- Where did VER gain on PER?
- Which laps opened the gap?
- Did tyre degradation impact pace?
- What was the turning point?
- What should a builder/analyst understand in 30 seconds?

### Task 4: Sisense-Ready Documentation

**Files:**
- Create or update: `README.md`
- Create or update: `strategy-brief.md`
- Create or update: `content-asset.md`
- Create or update: `loom-script.md`
- Create or update: prompt files under `prompts/`

Document local run path, optional Sisense Compose SDK path, and optional Sisense MCP Server path.

### Task 5: Verification

Run:
- `python -m pytest`
- `python -m compileall app etl tests`
- `streamlit run app/streamlit_app.py`

If dependencies are unavailable locally, document the exact missing package and installation command.

### Task 6: Screenshot / Visual Proof

**Files:**
- Create if possible: `docs/screenshots/dashboard.png`

Capture one dashboard screenshot after successful local run.

---

### Execution Status (2026-05-15)

- `Task 0` Completed
- `Task 1` Completed
- `Task 2` Completed
- `Task 3` Completed
- `Task 4` Completed
- `Task 5` Completed
- `Task 6` Partially Completed

Notes:
- Local app launch verified at `http://localhost:8501`.
- Automated screenshot capture via headless browser was blocked in this environment (`spawn EPERM`).
- Manual screenshot path is documented in `README.md` under `Manual Screenshot`.
