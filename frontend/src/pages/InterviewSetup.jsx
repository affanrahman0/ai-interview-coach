import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterview } from '../services/interviewService';
import { Settings, PlayCircle, Loader2 } from 'lucide-react';

const TYPES = ['HR', 'DSA', 'Backend', 'Frontend', 'Python', 'Java', 'SQL', 'System Design'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const QUESTION_COUNTS = [5, 10, 15];

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [interviewType, setInterviewType] = useState(TYPES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [numQuestions, setNumQuestions] = useState(QUESTION_COUNTS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      // We pass the exact payload the Python backend expects
      const interview = await startInterview({ 
        interview_type: interviewType, 
        difficulty: difficulty, 
        num_questions: numQuestions 
      });
      // The backend returns an interview object with a database ID. 
      // We use that ID to jump into the actual interview session!
      navigate(`/interview/${interview.id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to generate interview. Did you set up the AI API Key in backend/.env?');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Background Blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Settings className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-2">Configure Interview</h2>
          <p className="text-center text-slate-400 mb-8">Customize your AI mock interview session.</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Interview Topic</label>
              <select 
                value={interviewType} 
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Questions</label>
                <select 
                  value={numQuestions} 
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {QUESTION_COUNTS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            
            {error && <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg mt-4">{error}</p>}

            <button 
              onClick={handleStart}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 mt-6"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating AI Questions...</>
              ) : (
                <><PlayCircle className="w-5 h-5" /> Start Interview</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
