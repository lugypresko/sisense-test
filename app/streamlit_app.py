from __future__ import annotations

from pathlib import Path

import streamlit as st

from app.components.charts import (
    render_driver_delta,
    render_lap_time_trend,
    render_tyre_degradation,
)
from app.components.kpi_cards import render_kpi_cards
from app.components.pit_wall_insights import render_pit_wall_insights
from app.components.pit_wall_qa import answer_question
from app.data_adapters.local_data_adapter import LocalDataAdapter, calculate_kpis


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "processed"


def main() -> None:
    st.set_page_config(
        page_title="F1 Pit Wall Insights",
        page_icon="F1",
        layout="wide",
        initial_sidebar_state="collapsed",
    )
    _inject_styles()

    dataset = LocalDataAdapter(DATA_DIR).load()
    kpis = calculate_kpis(dataset)

    st.title("F1 Pit Wall Insights")
    st.caption(
        "Bahrain GP 2024 Race | VER vs PER | Local processed data | Sisense-ready adapter architecture"
    )

    render_kpi_cards(kpis)

    st.divider()
    render_lap_time_trend(dataset.laps)

    left, right = st.columns(2)
    with left:
        render_driver_delta(dataset.driver_delta)
    with right:
        render_tyre_degradation(dataset.laps)

    st.divider()
    render_pit_wall_insights(dataset.insights)

    st.divider()
    st.subheader("Ask the Pit Wall")
    question = st.text_input(
        "Ask a question about VER vs PER",
        placeholder="Where did VER create the gap over PER?",
    )
    if question.strip():
        qa = answer_question(question, dataset)
        with st.container(border=True):
            st.write(qa.answer)
            if qa.evidence_laps:
                st.caption(f"Evidence laps: {', '.join(str(l) for l in qa.evidence_laps)}")

    with st.expander("Sisense integration path"):
        st.write(
            "This demo runs locally from committed CSV/JSON files. The future embedded path "
            "is to replace the local adapter and Streamlit presentation with Sisense-backed "
            "queries and Compose SDK charts in a frontend app. The optional MCP path requires "
            "a Sisense instance URL and API token."
        )


def _inject_styles() -> None:
    st.markdown(
        """
        <style>
        .stApp {
            background: #07090d;
            color: #f8fafc;
        }
        [data-testid="stMetric"] {
            background: #111827;
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: 8px;
            padding: 14px 16px;
        }
        [data-testid="stMetricLabel"] {
            color: #a7f3d0;
        }
        div[data-testid="stExpander"], div[data-testid="stVerticalBlockBorderWrapper"] {
            border-color: rgba(148, 163, 184, 0.22);
            border-radius: 8px;
        }
        h1, h2, h3 {
            letter-spacing: 0;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
