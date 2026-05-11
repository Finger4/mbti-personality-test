"""Test service."""
from app.models.result import UserTestResult, UserAnswer
from app.models.question import TestQuestion
from app.services.scoring import calculate_mbti, generate_result_data

class TestService:
    def submit_test(self, db, user_id, answers_data, ip_address, duration_seconds):
        questions = db.query(TestQuestion).filter(TestQuestion.is_active == True).order_by(TestQuestion.question_number).all()
        # Build mapping from question_number (1-based) to question UUID
        q_num_to_uuid = {q.question_number: str(q.id) for q in questions}
        
        # Convert numeric question_ids to UUIDs (answers_data is list of dicts from test.py)
        normalized_answers = []
        for a in answers_data:
            qid = a["question_id"]
            qid_int = int(qid) if str(qid).isdigit() else None
            # If question_id is a number, convert to UUID
            if qid_int and qid_int in q_num_to_uuid:
                normalized_answers.append({
                    "question_id": q_num_to_uuid[qid_int],
                    "chosen_option": a["chosen_option"]
                })
            else:
                # Already a UUID
                normalized_answers.append({
                    "question_id": str(qid),
                    "chosen_option": a["chosen_option"]
                })
        
        q_list = [{"id": str(q.id), "dimension": q.dimension.code if q.dimension else "EI"} for q in questions]
        mbti_type, scores = calculate_mbti(normalized_answers, q_list)
        result_data = generate_result_data(mbti_type, scores)
        result = UserTestResult(
            user_id=user_id, result_type=mbti_type,
            score_e=scores["EI"]["E"], score_i=scores["EI"]["I"],
            score_s=scores["SN"]["S"], score_n=scores["SN"]["N"],
            score_t=scores["TF"]["T"], score_f=scores["TF"]["F"],
            score_j=scores["JP"]["J"], score_p=scores["JP"]["P"],
            result_data=result_data, ip_address=ip_address, duration_seconds=duration_seconds,
        )
        db.add(result)
        db.commit()
        db.refresh(result)
        for a in normalized_answers:
            ans = UserAnswer(result_id=result.id, question_id=a["question_id"],
                           chosen_option=a["chosen_option"], score=1 if a["chosen_option"] == "A" else 0)
            db.add(ans)
        db.commit()
        return result, result_data

    def get_questions(self, db):
        questions = db.query(TestQuestion).filter(TestQuestion.is_active == True).order_by(TestQuestion.question_number).all()
        return [{"id": str(q.id), "dimension": q.dimension.code if q.dimension else "EI",
                 "question_number": q.question_number, "content": q.content,
                 "option_a": q.option_a, "option_b": q.option_b} for q in questions]

test_service = TestService()
