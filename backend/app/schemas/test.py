"""Test schemas."""
from pydantic import BaseModel
from typing import Optional, List

class AnswerSubmit(BaseModel):
    question_id: str
    chosen_option: str

class TestSubmitRequest(BaseModel):
    answers: List[AnswerSubmit]
    duration_seconds: Optional[int] = 0

class TestSubmitResponse(BaseModel):
    result_id: str
    result_type: str

class QuestionResponse(BaseModel):
    id: str
    dimension: str
    question_number: int
    content: str
    option_a: str
    option_b: str

class TestResultData(BaseModel):
    id: str
    type: str
    name_cn: str
    name_en: str
    description: str
    radar_data: List[int]
    scores: dict
    dimension_analysis: dict
    career_suggestions: List[str]
    compatible_types: List[str]
    incompatible_types: List[str]
    color: str

class TestHistoryItem(BaseModel):
    id: str
    type: str
    created_at: str
    scores: dict
