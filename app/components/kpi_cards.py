from __future__ import annotations

import streamlit as st


def render_kpi_cards(kpis: dict) -> None:
    columns = st.columns(4)
    columns[0].metric(
        "Fastest lap",
        f"{kpis['fastest_lap']['seconds']:.2f}s",
        f"{kpis['fastest_lap']['driver']} lap {kpis['fastest_lap']['lap']}",
    )
    columns[1].metric(
        "Average gap",
        f"{kpis['average_gap_seconds']:.2f}s",
        kpis["selected_drivers"],
    )
    columns[2].metric(
        "Max stint drop",
        f"{kpis['stint_drop_seconds']:.2f}s",
        "end vs start",
    )
    columns[3].metric(
        "Turning point",
        f"Lap {kpis['turning_point_lap']}",
        "largest delta shift",
    )
