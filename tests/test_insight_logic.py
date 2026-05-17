import pandas as pd

from etl.transform_insights import build_insights


def test_build_insights_returns_plain_english_strategy_cards():
    laps = pd.DataFrame(
        [
            {"driver": "VER", "lap_number": 14, "lap_time_seconds": 93.0, "stint": 1},
            {"driver": "VER", "lap_number": 15, "lap_time_seconds": 92.8, "stint": 1},
            {"driver": "VER", "lap_number": 16, "lap_time_seconds": 92.7, "stint": 1},
            {"driver": "PER", "lap_number": 14, "lap_time_seconds": 93.4, "stint": 1},
            {"driver": "PER", "lap_number": 15, "lap_time_seconds": 93.6, "stint": 1},
            {"driver": "PER", "lap_number": 16, "lap_time_seconds": 94.2, "stint": 1},
        ]
    )
    driver_delta = pd.DataFrame(
        [
            {"lap_number": 14, "delta_seconds": -0.4, "cumulative_delta": -0.4},
            {"lap_number": 15, "delta_seconds": -0.8, "cumulative_delta": -1.2},
            {"lap_number": 16, "delta_seconds": -1.5, "cumulative_delta": -2.7},
        ]
    )

    insights = build_insights(laps, driver_delta, "VER", "PER")

    assert len(insights) == 4
    assert insights[0]["title"] == "Pace Advantage"
    assert "VER" in insights[0]["summary"]
    assert isinstance(insights[0]["evidence_laps"], list)
    assert insights[2]["title"] == "Strategy Moment"
    assert "lap 16" in insights[2]["summary"]
