"""Test service."""
from app.models.result import UserTestResult, UserAnswer
from app.models.question import TestQuestion
from app.services.scoring import calculate_mbti, generate_result_data

class TestService:
    def submit_test(self, db, user_id, answers_data, ip_address, duration_seconds):
        questions = db.query(TestQuestion).filter(TestQuestion.is_active == True).all()
        q_list = [{"id": str(q.id), "dimension": q.dimension.code if q.dimension else "EI"} for q in questions]
        print(f"[DEBUG] q_list len={len(q_list)}, first dim={q_list[0]['dimension'] if q_list else 'EMPTY'}")
        print(f"[DEBUG] answers_data len={len(answers_data)}, first 3={answers_data[:3]}")
        mbti_type, scores = calculate_mbti(answers_data, q_list)
        print(f"[DEBUG] calculated scores={scores}")
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
        for a in answers_data:
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
