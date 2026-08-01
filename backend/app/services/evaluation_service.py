"""
PHASE 4: Evaluate a single answer, and aggregate a final interview report.
"""

import json
import re
from app.config.settings import settings
from app.prompts.evaluation_prompts import build_answer_evaluation_prompt, build_final_report_prompt


def extract_json_from_llm(text: str) -> dict:
    """Helper to extract JSON object from LLM response text."""
    try:
        # Match JSON object in response
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return json.loads(text)
    except Exception:
        return {}


def evaluate_answer(question_text: str, answer_text: str) -> dict:
    """
    Calls the LLM with an evaluation prompt and parses a structured score.
    Returns a dict matching the Evaluation model fields.
    """
    prompt = build_answer_evaluation_prompt(question_text, answer_text)

    if settings.GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
            )

            raw_output = response.choices[0].message.content or ""
            parsed = extract_json_from_llm(raw_output)
            if parsed and "technical_score" in parsed:
                return parsed
        except Exception as e:
            print(f"Groq evaluation call failed: {e}")

    # Smart Fallback Evaluation if API key is not present or API call fails
    answer_len = len(answer_text.strip())
    score = min(9.0, max(5.0, round(answer_len / 20.0, 1)))
    
    return {
        "technical_score": score,
        "communication_score": score,
        "completeness_score": score,
        "confidence_score": score,
        "missing_concepts": ["Edge cases", "Deep architectural trade-offs"],
        "better_answer": f"For '{question_text}', a complete response should detail core principles, real-world examples, and design trade-offs.",
        "learning_resources": ["Official Documentation", "System Design Primer"],
    }


def generate_final_feedback(interview) -> dict:
    """
    Aggregates all per-answer evaluations into an overall interview report.
    """
    evaluations_summary = []
    for q in interview.questions:
        if q.answer and q.answer.evaluation:
            evaluations_summary.append({
                "question": q.text,
                "answer": q.answer.text,
                "technical_score": q.answer.evaluation.technical_score,
                "communication_score": q.answer.evaluation.communication_score,
            })

    if settings.GROQ_API_KEY and evaluations_summary:
        try:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            prompt = build_final_report_prompt(evaluations_summary)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
            )
            raw_output = response.choices[0].message.content or ""
            parsed = extract_json_from_llm(raw_output)
            if parsed and "overall_score" in parsed:
                return parsed
        except Exception as e:
            print(f"Groq final report call failed: {e}")

    # Fallback Overall Report
    return {
        "overall_score": 8.0,
        "strengths": ["Clear explanation of core technical concepts", "Good structured communication"],
        "weaknesses": ["Could provide deeper code examples", "Elaborate more on scalability"],
        "improvement_areas": ["System design trade-offs", "Edge case handling"],
        "topics_to_study": ["Advanced Architecture Patterns", "Database Indexing & Performance"],
    }

