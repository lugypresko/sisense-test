from pathlib import Path

from app.components.pit_wall_qa import answer_question
from app.data_adapters.local_data_adapter import LocalDataAdapter


def _dataset():
    return LocalDataAdapter(Path("data/processed")).load()


def test_gap_question_returns_evidence_laps():
    qa = answer_question("Where did VER create the gap?", _dataset())
    assert "VER" in qa.answer
    assert len(qa.evidence_laps) >= 1


def test_turning_point_question_returns_single_key_lap():
    qa = answer_question("What is the turning point?", _dataset())
    assert "Turning point" in qa.answer
    assert len(qa.evidence_laps) == 1

