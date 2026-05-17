from pathlib import Path

from app.data_adapters.local_data_adapter import LocalDataAdapter, calculate_kpis


def test_local_data_adapter_loads_processed_data():
    adapter = LocalDataAdapter(Path("data/processed"))

    dataset = adapter.load()

    assert set(dataset.laps["driver"].unique()) == {"VER", "PER"}
    assert {"driver", "lap", "lap_time", "tyre", "stint"}.issubset(dataset.laps.columns)
    assert {"lap", "delta_seconds"}.issubset(dataset.driver_delta.columns)
    assert {"driver", "stint", "compound", "start_lap", "end_lap"}.issubset(dataset.stints.columns)
    assert len(dataset.driver_delta) >= 5
    assert len(dataset.stints) >= 2
    assert [item["title"] for item in dataset.insights] == [
        "Pace Advantage",
        "Tyre Degradation Signal",
        "Strategy Moment",
        "Builder Note",
    ]
    assert {"title", "summary", "evidence_laps"}.issubset(dataset.insights[0].keys())


def test_calculate_kpis_returns_dashboard_metrics():
    dataset = LocalDataAdapter(Path("data/processed")).load()

    kpis = calculate_kpis(dataset)

    assert kpis["selected_race"] == "Bahrain GP 2024"
    assert kpis["selected_drivers"] == "VER vs PER"
    assert kpis["fastest_lap"]["driver"] == "VER"
    assert kpis["fastest_lap"]["seconds"] == 92.41
    assert kpis["turning_point_lap"] == 19
