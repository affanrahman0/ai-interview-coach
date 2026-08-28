import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInterviewSession, submitAnswer, completeInterview } from '../services/interviewService';
import { ChevronRight, CheckCircle, Loader2, MessageSquare } from 'lucide-react';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getInterviewSession(id);
        setInterview(data);
      } catch (err) {
        setError('Failed to load interview session.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading your interview...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-400 bg-red-400/10 px-6 py-4 rounded-xl">{error || 'Session not found'}</p>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentIndex];
  const isLastQuestion = currentIndex === interview.questions.length - 1;
  const progressPercentage = ((currentIndex) / interview.questions.length) * 100;

  const handleNext = async () => {
    if (!answerText.trim()) return;
    
    setSubmitting(true);
    try {
      // 1. Submit the answer to the backend
      await submitAnswer(currentQuestion.id, answerText);
      setAnswerText(''); // Clear the box for the next question

      if (isLastQuestion) {
        // 2. If it's the last question, complete the interview and generate the report!
        await completeInterview(id);
        navigate(`/interview/${id}/report`);
      } else {
        // 3. Otherwise, just move to the next question
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Progress Bar Header */}
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-400">
              {interview.interview_type} Interview
            </span>
            <span className="text-sm font-bold text-indigo-400">
              Question {currentIndex + 1} of {interview.questions.length}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col">
        
        {/* Question Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-6 shadow-lg flex gap-4 items-start">
          <div className="p-3 bg-indigo-500/10 rounded-xl shrink-0 mt-1">
            <MessageSquare className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">The Question</h3>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200">
              {currentQuestion?.text}
            </p>
          </div>
        </div>

        {/* Answer Box */}
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-300">Your Answer</span>
          </div>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={submitting}
            placeholder="Type your detailed answer here... Take your time."
            className="flex-1 w-full bg-transparent p-6 text-slate-300 resize-none outline-none leading-relaxed placeholder:text-slate-600 min-h-[250px]"
          />
        </div>

        {/* Action Bar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            disabled={submitting || !answerText.trim()}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg
              ${isLastQuestion 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {isLastQuestion ? 'Analyzing...' : 'Saving...'}</>
            ) : isLastQuestion ? (
              <>Complete Interview <CheckCircle className="w-5 h-5" /></>
            ) : (
              <>Next Question <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
        
      </main>
    </div>
  );
};

export default InterviewSession;
