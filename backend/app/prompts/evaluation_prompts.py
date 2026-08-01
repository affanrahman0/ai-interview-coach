"""
PHASE 4: Prompt templates for evaluating answers and generating the final report.
"""

def build_answer_evaluation_prompt(question: str, answer: str) -> str:
    return f"""
You are an expert interview evaluator. Evaluate the candidate's answer below.

Question: {question}
Candidate Answer: {answer}

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

Return ONLY valid JSON with this exact shape:
{{
  "overall_score": <0-10>,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvement_areas": ["..."],
  "topics_to_study": ["..."]
}}
"""
