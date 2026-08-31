# AI Interview Coach 🚀

AI Interview Coach is a full-stack, AI-powered application designed to help users prepare for technical and behavioral interviews. It dynamically generates tailored interview questions based on the user's uploaded resume and provides real-time, actionable feedback on their answers using LLMs.

## 🌟 Features
- **Resume Parsing:** Upload a PDF resume, and the AI extracts your skills, experience, and projects to generate highly specific interview questions.
- **Dynamic Interviews:** Choose your interview type (Technical, Behavioral) and difficulty level.
- **Real-time AI Feedback:** Get instant evaluation and scoring on your answers powered by Groq/Llama3.
- **Progress Tracking:** A sleek dashboard with a Recharts-powered progress graph to track your scores and study recommendations over time.
- **Cloud Storage:** Securely stores uploaded resumes in the cloud using Cloudinary.

## 🏗️ Architecture & Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** PostgreSQL
- **AI Models:** Groq API (Llama3-8b-8192 for low latency)
- **Cloud Storage:** Cloudinary
- **Containerization:** Docker & Docker Compose

## ☁️ Live Demo
- **Frontend:** [https://ai-interview-coach-pi-two.vercel.app](https://ai-interview-coach-pi-two.vercel.app)
- **Backend API Docs:** [https://ai-interview-coach-b84m.onrender.com/docs](https://ai-interview-coach-b84m.onrender.com/docs)

---

## 🚀 Local Development Setup

### Prerequisites
- Docker & Docker Compose installed.
- API Keys for **Groq** and **Cloudinary**.

### Running the Application Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ai-interview-coach.git
   cd ai-interview-coach
   ```

2. **Set up Environment Variables:**
   Create a `.env` file inside the `backend/` folder:
   ```env
   # Database
   DATABASE_URL=postgresql://postgres:postgres@db:5432/ai_interviewer
   
   # Security
   SECRET_KEY=generate_a_random_secure_string_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   
   # AI & Storage Keys
   GROQ_API_KEY=your_groq_api_key_here
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```

3. **Start the containers:**
   ```bash
   docker-compose up --build
   ```

4. **Access the App:**
   - **Frontend:** http://localhost:5173
   - **Backend API Docs:** http://localhost:8000/docs
