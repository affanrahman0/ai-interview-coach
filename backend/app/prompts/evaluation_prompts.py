"""
PHASE 4: Prompt templates for evaluating answers and generating the final report.
"""

def build_answer_evaluation_prompt(question: str, answer: str) -> str:
    return f"""
You are an expert interview evaluator. Evaluate the candidate's answer below.

Question: {question}
Candidate Answer: {answer}

Scoring Rules:
1. IF the answer is random letters, gibberish, "I don't know", or completely unrelated, you MUST give a 0 for all scores.
2. Be brutally honest and strict. Do not give average scores (4-6) just to be polite.

Return ONLY valid JSON with this exact shape:
{{
  "technical_score": <0-10>,
  "communication_score": <0-10>,
  "completeness_score": <0-10>,
  "confidence_score": <0-10>,
  "missing_concepts": ["..."],
  "better_answer": "...",
  "learning_resources": ["..."]
}}
"""


def build_final_report_prompt(all_evaluations: list) -> str:
    return f"""
You are summarizing an entire interview performance based on these evaluations:
{all_evaluations}

Scoring Rules:
1. IF the evaluations show terrible scores (0-3) or mostly gibberish/unrelated answers, DO NOT hallucinate strengths like "team collaboration". You MUST output ["None"] for strengths.
2. Be brutally honest based ONLY on the provided evaluations. Do not make up facts.

Return ONLY valid JSON with this exact shape:
{{
  "overall_score": <0-10>,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvement_areas": ["..."],
  "topics_to_study": ["..."]
}}
"""
