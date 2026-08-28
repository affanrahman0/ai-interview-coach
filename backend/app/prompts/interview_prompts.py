"""
PHASE 3: Prompt templates for question generation.
This is where prompt engineering happens - keep prompts here, not scattered in services.
"""

def build_question_generation_prompt(
    resume_text: str,
    interview_type: str,
    difficulty: str,
    num_questions: int,
) -> str:
    return f"""
You are an expert technical interviewer.

Candidate resume:
{resume_text}

Task:
Generate exactly {num_questions} interview questions for a "{interview_type}" interview
at "{difficulty}" difficulty, personalized to the candidate's resume above.

Rules:
- Questions should reference specific skills/projects from the resume where relevant.
- You MUST output ONLY valid JSON in the exact following format:
  {{"questions": ["question 1 text", "question 2 text", "question 3 text"]}}
"""
