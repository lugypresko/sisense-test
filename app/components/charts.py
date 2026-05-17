from __future__ import annotations

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st


PLOT_TEMPLATE = "plotly_dark"
ACCENT_COLORS = ["#00D2BE", "#F9D923", "#FF5A5F", "#9BDBFF"]


def render_lap_time_trend(laps: pd.DataFrame) -> None:
    fig = px.line(
        laps,
        x="lap",
        y="lap_time",
        color="driver",
        markers=True,
        color_discrete_sequence=ACCENT_COLORS,
        template=PLOT_TEMPLATE,
        labels={
            "lap": "Lap",
            "lap_time": "Lap time (s)",
            "driver": "Driver",
        },
    )
    _finish_chart(fig, "Lap time trend")
    st.plotly_chart(fig, use_container_width=True)


def render_driver_delta(driver_delta: pd.DataFrame) -> None:
    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=driver_delta["lap"],
            y=driver_delta["delta_seconds"],
            mode="lines+markers",
            name="Single-lap delta",
            line={"color": "#00D2BE", "width": 3},
        )
    )
    fig.add_hline(y=0, line_dash="dash", line_color="#6b7280")
    _finish_chart(fig, "Driver delta (VER minus PER)")
    fig.update_yaxes(title="Delta seconds")
    fig.update_xaxes(title="Lap")
    st.plotly_chart(fig, use_container_width=True)


def render_tyre_degradation(laps: pd.DataFrame) -> None:
    fig = px.scatter(
        laps,
        x="tyre_life",
        y="lap_time",
        color="driver",
        symbol="tyre",
        color_discrete_sequence=ACCENT_COLORS,
        template=PLOT_TEMPLATE,
        labels={
            "tyre_life": "Tyre life (laps)",
            "lap_time": "Lap time (s)",
            "tyre": "Tyre",
        },
    )
    _finish_chart(fig, "Tyre degradation signal")
    st.plotly_chart(fig, use_container_width=True)


def _finish_chart(fig: go.Figure, title: str) -> None:
    fig.update_layout(
        title=title,
        margin={"l": 10, "r": 10, "t": 48, "b": 10},
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        legend_title_text="",
        font={"family": "Inter, Segoe UI, Arial", "size": 13},
        title_font={"size": 18},
    )
    fig.update_xaxes(gridcolor="rgba(148,163,184,0.18)")
    fig.update_yaxes(gridcolor="rgba(148,163,184,0.18)")
