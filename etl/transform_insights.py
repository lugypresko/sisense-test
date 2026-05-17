from __future__ import annotations

import argparse
import json
from pathlib import Path

import pandas as pd


def build_insights(
    laps: pd.DataFrame,
    driver_delta: pd.DataFrame,
    driver_a: str,
    driver_b: str,
) -> list[dict[str, str]]:
    driver_means = laps.groupby("driver")["lap_time_seconds"].mean()
    faster_driver = str(driver_means.idxmin())
    slower_driver = driver_b if faster_driver == driver_a else driver_a
    pace_gap = abs(float(driver_means[driver_a] - driver_means[driver_b]))

    degradation_lap = _find_degradation_lap(laps)
    turning_lap = _find_turning_point_lap(driver_delta)

    return [
        {
            "title": "Pace Advantage",
            "summary": (
                f"{faster_driver} was on average {pace_gap:.2f}s faster per lap "
                f"than {slower_driver} across the selected run."
            ),
            "evidence_laps": _best_gap_window(driver_delta),
            "why_it_matters": (
                "A repeatable pace gap over multiple laps usually matters more "
                "than a single fastest lap."
            ),
        },
        {
            "title": "Tyre Degradation Signal",
            "summary": (
                f"Lap times started drifting upward around lap {degradation_lap}, "
                "suggesting the tyre performance window was closing."
            ),
            "evidence_laps": [degradation_lap - 1, degradation_lap, degradation_lap + 1],
            "why_it_matters": (
                "This is the kind of signal a pit wall watches before deciding "
                "whether to stop or extend the stint."
            ),
        },
        {
            "title": "Strategy Moment",
            "summary": (
                f"The largest delta shift happened around lap {turning_lap}, "
                "which may indicate traffic, tyre drop-off, or pit strategy impact."
            ),
            "evidence_laps": [turning_lap],
            "why_it_matters": "This is where a race engineer would look first.",
        },
        {
            "title": "Builder Note",
            "summary": (
                "From raw F1 telemetry to a pit-wall decision dashboard builders can run "
                "locally and later connect to Sisense."
            ),
            "evidence_laps": [],
            "why_it_matters": (
                "Sisense can become the analytics layer when builders need trusted, "
                "embedded analytics rather than one-off charts."
            ),
        },
    ]


def _find_degradation_lap(laps: pd.DataFrame) -> int:
    ordered = laps.sort_values(["driver", "lap_number"]).copy()
    ordered["rolling_lap_time"] = (
        ordered.groupby("driver")["lap_time_seconds"]
        .rolling(3, min_periods=1)
        .mean()
        .reset_index(level=0, drop=True)
    )
    ordered["rolling_change"] = ordered.groupby("driver")["rolling_lap_time"].diff()
    row = ordered.loc[ordered["rolling_change"].fillna(0).idxmax()]
    return int(row["lap_number"])


def _find_turning_point_lap(driver_delta: pd.DataFrame) -> int:
    shifts = driver_delta["delta_seconds"].diff().abs().fillna(0)
    lap_column = "lap" if "lap" in driver_delta.columns else "lap_number"
    return int(driver_delta.loc[shifts.idxmax(), lap_column])


def _best_gap_window(driver_delta: pd.DataFrame) -> list[int]:
    lap_column = "lap" if "lap" in driver_delta.columns else "lap_number"
    strongest = driver_delta.nsmallest(3, "delta_seconds")[lap_column].astype(int).tolist()
    return sorted(strongest)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate pit wall insights JSON.")
    parser.add_argument("--processed-dir", default="data/processed")
    parser.add_argument("--driver-a", default="VER")
    parser.add_argument("--driver-b", default="PER")
    args = parser.parse_args()

    processed_dir = Path(args.processed_dir)
    laps = pd.read_csv(processed_dir / "laps.csv")
    driver_delta = pd.read_csv(processed_dir / "driver_delta.csv")
    insights = build_insights(laps, driver_delta, args.driver_a, args.driver_b)

    with (processed_dir / "insights.json").open("w", encoding="utf-8") as handle:
        json.dump(insights, handle, indent=2)
        handle.write("\n")


if __name__ == "__main__":
    main()
