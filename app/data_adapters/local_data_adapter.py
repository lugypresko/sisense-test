from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd


@dataclass(frozen=True)
class F1Dataset:
    laps: pd.DataFrame
    driver_delta: pd.DataFrame
    stints: pd.DataFrame
    insights: list[dict[str, str]]


class LocalDataAdapter:
    """Loads committed processed data for the no-credentials demo path."""

    def __init__(self, processed_data_dir: Path | str) -> None:
        self.processed_data_dir = Path(processed_data_dir)

    def load(self) -> F1Dataset:
        laps = pd.read_csv(self.processed_data_dir / "laps.csv")
        driver_delta = pd.read_csv(self.processed_data_dir / "driver_delta.csv")
        stints = pd.read_csv(self.processed_data_dir / "stints.csv")
        with (self.processed_data_dir / "insights.json").open("r", encoding="utf-8") as handle:
            insights = json.load(handle)

        laps = self._normalize_laps(laps)
        driver_delta = self._normalize_driver_delta(driver_delta)
        stints = self._normalize_stints(stints)
        insights = self._normalize_insights(insights)

        return F1Dataset(
            laps=laps,
            driver_delta=driver_delta,
            stints=stints,
            insights=insights,
        )

    @staticmethod
    def _normalize_laps(laps: pd.DataFrame) -> pd.DataFrame:
        renamed = laps.copy()
        if "lap" not in renamed.columns and "lap_number" in renamed.columns:
            renamed["lap"] = renamed["lap_number"]
        if "lap_time" not in renamed.columns and "lap_time_seconds" in renamed.columns:
            renamed["lap_time"] = renamed["lap_time_seconds"]
        if "tyre" not in renamed.columns and "compound" in renamed.columns:
            renamed["tyre"] = renamed["compound"]
        return renamed

    @staticmethod
    def _normalize_driver_delta(driver_delta: pd.DataFrame) -> pd.DataFrame:
        renamed = driver_delta.copy()
        if "lap" not in renamed.columns and "lap_number" in renamed.columns:
            renamed["lap"] = renamed["lap_number"]
        return renamed

    @staticmethod
    def _normalize_stints(stints: pd.DataFrame) -> pd.DataFrame:
        return stints

    @staticmethod
    def _normalize_insights(insights: list[dict[str, str]]) -> list[dict[str, str]]:
        normalized: list[dict[str, str]] = []
        for item in insights:
            normalized.append(
                {
                    "title": item.get("title", ""),
                    "summary": item.get("summary", item.get("insight", "")),
                    "evidence_laps": item.get("evidence_laps", []),
                    "why_it_matters": item.get("why_it_matters", ""),
                }
            )
        return normalized


def calculate_kpis(dataset: F1Dataset) -> dict[str, Any]:
    laps = dataset.laps.copy()
    delta = dataset.driver_delta.copy()
    if {"driver_a", "driver_b"}.issubset(delta.columns):
        drivers = [str(delta["driver_a"].iloc[0]), str(delta["driver_b"].iloc[0])]
    else:
        drivers = sorted(laps["driver"].unique().tolist())

    fastest_row = laps.loc[laps["lap_time"].idxmin()]
    avg_gap = abs(float(delta["delta_seconds"].mean()))
    turning_idx = delta["delta_seconds"].diff().abs().fillna(0).idxmax()
    turning_point_lap = int(delta.loc[turning_idx, "lap"])

    stint_drop = 0.0
    for _, stint in dataset.stints.iterrows():
        stint_drop = max(stint_drop, float(stint["drop_seconds"]))

    return {
        "selected_race": f"{laps['race'].iloc[0]} {int(laps['season'].iloc[0])}",
        "selected_drivers": " vs ".join(drivers),
        "total_laps_analyzed": int(laps["lap"].nunique()),
        "fastest_lap": {
            "driver": str(fastest_row["driver"]),
            "lap": int(fastest_row["lap"]),
            "seconds": round(float(fastest_row["lap_time"]), 3),
        },
        "average_gap_seconds": round(avg_gap, 3),
        "stint_drop_seconds": round(stint_drop, 3),
        "turning_point_lap": turning_point_lap,
    }
