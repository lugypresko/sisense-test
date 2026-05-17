from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd


def seconds(value) -> float | None:
    if pd.isna(value):
        return None
    return round(pd.to_timedelta(value).total_seconds(), 3)


def extract_fastf1_data(
    year: int,
    race: str,
    session_name: str,
    drivers: list[str],
    output_dir: Path,
) -> None:
    import fastf1

    fastf1.Cache.enable_cache(str(output_dir.parent / "fastf1_cache"))
    session = fastf1.get_session(year, race, session_name)
    session.load()

    laps = session.laps.pick_drivers(drivers).copy()
    rows = []
    for _, lap in laps.iterrows():
        rows.append(
            {
                "season": year,
                "race": f"{race} GP" if not race.endswith("GP") else race,
                "session": session_name,
                "driver": lap["Driver"],
                "lap_number": int(lap["LapNumber"]),
                "lap_time_seconds": seconds(lap["LapTime"]),
                "sector1_seconds": seconds(lap["Sector1Time"]),
                "sector2_seconds": seconds(lap["Sector2Time"]),
                "sector3_seconds": seconds(lap["Sector3Time"]),
                "compound": lap["Compound"],
                "tyre_life": int(lap["TyreLife"]) if pd.notna(lap["TyreLife"]) else None,
                "stint": int(lap["Stint"]) if pd.notna(lap["Stint"]) else None,
                "pit_in_time": str(lap["PitInTime"]) if pd.notna(lap["PitInTime"]) else "",
                "pit_out_time": str(lap["PitOutTime"]) if pd.notna(lap["PitOutTime"]) else "",
                "is_accurate": bool(lap["IsAccurate"]),
            }
        )

    output_dir.mkdir(parents=True, exist_ok=True)
    laps_df = pd.DataFrame(rows).dropna(subset=["lap_time_seconds"])
    laps_df.to_csv(output_dir / "laps.csv", index=False)
    _write_driver_delta(laps_df, drivers[0], drivers[1], output_dir / "driver_delta.csv")
    _write_stints(laps_df, output_dir / "stints.csv")


def _write_driver_delta(laps: pd.DataFrame, driver_a: str, driver_b: str, path: Path) -> None:
    pivot = laps.pivot_table(
        index="lap_number",
        columns="driver",
        values="lap_time_seconds",
        aggfunc="first",
    ).dropna(subset=[driver_a, driver_b])
    delta = pd.DataFrame(
        {
            "lap_number": pivot.index.astype(int),
            "driver_a": driver_a,
            "driver_b": driver_b,
            "driver_a_lap_time": pivot[driver_a].values,
            "driver_b_lap_time": pivot[driver_b].values,
        }
    )
    delta["delta_seconds"] = delta["driver_a_lap_time"] - delta["driver_b_lap_time"]
    delta["cumulative_delta"] = delta["delta_seconds"].cumsum()
    delta.to_csv(path, index=False)


def _write_stints(laps: pd.DataFrame, path: Path) -> None:
    rows = []
    for (driver, stint), group in laps.groupby(["driver", "stint"]):
        ordered = group.sort_values("lap_number")
        rows.append(
            {
                "driver": driver,
                "stint": int(stint),
                "compound": ordered["compound"].iloc[0],
                "start_lap": int(ordered["lap_number"].min()),
                "end_lap": int(ordered["lap_number"].max()),
                "start_avg_seconds": round(float(ordered["lap_time_seconds"].head(3).mean()), 3),
                "end_avg_seconds": round(float(ordered["lap_time_seconds"].tail(3).mean()), 3),
                "drop_seconds": round(
                    float(ordered["lap_time_seconds"].tail(3).mean() - ordered["lap_time_seconds"].head(3).mean()),
                    3,
                ),
            }
        )
    pd.DataFrame(rows).to_csv(path, index=False)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract FastF1 data into processed CSV files.")
    parser.add_argument("--year", type=int, default=2024)
    parser.add_argument("--race", default="Bahrain")
    parser.add_argument("--session", default="R")
    parser.add_argument("--drivers", nargs=2, default=["VER", "PER"])
    parser.add_argument("--output-dir", default="data/processed")
    args = parser.parse_args()

    extract_fastf1_data(
        year=args.year,
        race=args.race,
        session_name=args.session,
        drivers=args.drivers,
        output_dir=Path(args.output_dir),
    )


if __name__ == "__main__":
    main()
