from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from app.data_adapters.local_data_adapter import F1Dataset


@dataclass(frozen=True)
class QaAnswer:
    question: str
    answer: str
    evidence_laps: list[int]


def answer_question(question: str, dataset: F1Dataset) -> QaAnswer:
    q = question.lower().strip()
    if not q:
        return QaAnswer(question=question, answer="Ask about gap, turning point, or tyre degradation.", evidence_laps=[])

    if _has_any(q, ["gap", "פער", "gain", "פתח"]):
        return _answer_gap(dataset, question)
    if _has_any(q, ["turning", "point", "turn", "מפנה"]):
        return _answer_turning_point(dataset, question)
    if _has_any(q, ["tyre", "tire", "degradation", "שחיקה"]):
        return _answer_degradation(dataset, question)

    return QaAnswer(
        question=question,
        answer="I can answer: where VER gained on PER, turning point lap, and tyre degradation timing.",
        evidence_laps=[],
    )


def _answer_gap(dataset: F1Dataset, original_question: str) -> QaAnswer:
    delta = dataset.driver_delta.copy()
    strongest = delta.nsmallest(5, "delta_seconds")
    laps = strongest["lap"].astype(int).tolist()
    avg = abs(float(strongest["delta_seconds"].mean()))
    return QaAnswer(
        question=original_question,
        answer=f"VER built the gap most clearly around laps {laps[0]}-{laps[-1]}, averaging about {avg:.2f}s gain per lap in that window.",
        evidence_laps=laps,
    )


def _answer_turning_point(dataset: F1Dataset, original_question: str) -> QaAnswer:
    delta = dataset.driver_delta.copy()
    shifts = delta["delta_seconds"].diff().abs().fillna(0)
    idx = shifts.idxmax()
    lap = int(delta.loc[idx, "lap"])
    jump = float(shifts.loc[idx])
    return QaAnswer(
        question=original_question,
        answer=f"Turning point is lap {lap}, where the single-lap delta changed by {jump:.2f}s versus the previous lap.",
        evidence_laps=[lap],
    )


def _answer_degradation(dataset: F1Dataset, original_question: str) -> QaAnswer:
    laps = dataset.laps.copy()
    per = laps[laps["driver"] == "PER"].sort_values("lap")
    if per.empty:
        return QaAnswer(question=original_question, answer="No PER data available.", evidence_laps=[])
    per["rolling"] = per["lap_time"].rolling(3, min_periods=1).mean()
    per["drift"] = per["rolling"].diff().fillna(0)
    idx = per["drift"].idxmax()
    lap = int(per.loc[idx, "lap"])
    return QaAnswer(
        question=original_question,
        answer=f"Tyre degradation signal appears around lap {lap}, where PER's rolling pace drift accelerates.",
        evidence_laps=[lap - 1, lap, lap + 1],
    )


def _has_any(text: str, terms: list[str]) -> bool:
    return any(term in text for term in terms)

