import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReport } from '../services/interviewService';
import { Award, BookOpen, TrendingUp, AlertTriangle, ChevronLeft, Loader2 } from 'lucide-react';

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReport(id);
        setReport(data);
      } catch (err) {
        setError('Failed to load your interview report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">AI is grading your interview...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-400 bg-red-400/10 px-6 py-4 rounded-xl">{error || 'Report not found'}</p>
      </div>
    );
  }

  // Helper to safely parse the JSON lists coming from the database!
  const parseList = (data) => {
    if (Array.isArray(data)) return data;
    try {
      return JSON.parse(data) || [];
    } catch {
      return [];
    }
  };

  const strengths = parseList(report.strengths);
  const weaknesses = parseList(report.weaknesses);
  const improvementAreas = parseList(report.improvement_areas);
  const topicsToStudy = parseList(report.topics_to_study);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Score */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          
          <div className="relative z-10">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight">Interview Report</h1>
            <p className="text-slate-400 mt-2">Here is a detailed breakdown of your performance.</p>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-8 py-6 rounded-2xl relative z-10">
            <Award className="w-12 h-12 text-emerald-400" />
            <div>
              <p className="text-sm text-emerald-400/80 font-semibold uppercase tracking-wider">Overall Score</p>
              <p className="text-4xl font-black text-emerald-400">{report.overall_score}<span className="text-2xl text-emerald-600">/10</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold">Key Strengths</h2>
            </div>
            <ul className="space-y-3">
              {strengths.map((s, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <span className="text-emerald-500 font-bold">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold">Areas of Weakness</h2>
            </div>
            <ul className="space-y-3">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <span className="text-red-500 font-bold">•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold">Recommended Study Plan</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Concepts to Review</h3>
              <ul className="space-y-2">
                {topicsToStudy.map((t, i) => (
                  <li key={i} className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-slate-300">{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Actionable Improvements</h3>
              <ul className="space-y-2">
                {improvementAreas.map((ia, i) => (
                  <li key={i} className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-slate-300">{ia}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Report;
