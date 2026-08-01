"""
PHASE 3: Wrapper around the LLM provider (Groq or Gemini) for question generation.
"""

from app.config.settings import settings
from app.prompts.interview_prompts import build_question_generation_prompt
from groq import Groq

def generate_interview_questions(
    resume_text: str,
    interview_type: str,
    difficulty: str,
    num_questions: int,
) -> list[str]:
    prompt = build_question_generation_prompt(
        resume_text=resume_text,
        interview_type=interview_type,
        difficulty=difficulty,
        num_questions=num_questions,
    )

    # 1. Try calling Groq API if key is present
    if settings.GROQ_API_KEY:
        try:
            
            client = Groq(api_key=settings.GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
            )

            raw_output = response.choices[0].message.content or ""
            questions = [q.strip() for q in raw_output.split("\n") if q.strip()]
            if questions:
                return questions[:num_questions]
        except Exception as e:
            print(f"Groq API call failed: {e}")

    # 2. Fallback Question Generator (if no AI key or API fails)
    fallback_questions = [
        f"Can you tell me about your background in {interview_type} and walk me through a major project from your resume?",
        f"How would you approach solving a complex {difficulty}-level problem in {interview_type}?",
        f"What are the best practices for scalable architecture and performance optimization in {interview_type}?",
        f"Can you explain a challenging technical bug you encountered in a recent project and how you resolved it?",
        f"How do you stay up-to-date with emerging trends and frameworks in {interview_type} development?",
        f"Describe a situation where you had to collaborate with a team to deliver a critical {interview_type} feature under a tight deadline.",
        f"What trade-offs do you consider when choosing between different tools or frameworks in {interview_type}?",
        f"Can you explain how memory management and performance profiling work in {interview_type}?",
        f"What steps do you take to ensure code quality, automated testing, and maintainability in your projects?",
        f"Where do you see the biggest growth opportunities in {interview_type} over the next few years?"
    ]

    return fallback_questions[:num_questions]
