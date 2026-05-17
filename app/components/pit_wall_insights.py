from __future__ import annotations

import streamlit as st


def render_pit_wall_insights(insights: list[dict[str, str]]) -> None:
    st.subheader("Pit Wall Insights")
    for insight in insights:
        with st.container(border=True):
            st.markdown(f"**{insight['title']}**")
            st.write(insight["summary"])
            evidence_laps = insight.get("evidence_laps", [])
            if evidence_laps:
                st.caption(f"Evidence laps: {', '.join(str(lap) for lap in evidence_laps)}")
            st.caption(insight["why_it_matters"])
