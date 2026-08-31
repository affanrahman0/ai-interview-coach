import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary, getInterviewHistory } from '../services/dashboardService';
import { LogOut, PlusCircle, Clock, Award, FileText, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryData, historyData] = await Promise.all([
          getDashboardSummary(),
          getInterviewHistory()
        ]);
        setSummary(summaryData);
        setHistory(historyData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Prepare data for the graph (only completed interviews, sorted chronologically)
  const chartData = useMemo(() => {
    if (!history) return [];
    
    return history
      .filter(session => session.status === 'completed' && session.overall_score !== null)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map(session => ({
        date: new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: session.overall_score,
        type: session.interview_type
      }));
  }, [history]);

  // Custom Tooltip for the Recharts graph
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl">
          <p className="text-slate-300 font-medium mb-1">{label}</p>
          <p className="text-indigo-400 font-bold text-lg">Score: {payload[0].value}/10</p>
          <p className="text-slate-400 text-sm mt-1 border-t border-slate-700 pt-1">
            Topic: <span className="text-slate-300">{payload[0].payload.type}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI Interview Coach
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Welcome, {user?.name?.split(' ')[0] || 'User'}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Dashboard</h2>
            <p className="text-slate-400 mt-1">Track your progress and start new sessions</p>
          </div>
          <button
            onClick={() => navigate('/resume')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20"
          >
            <PlusCircle className="w-5 h-5" />
            New Interview
          </button>
        </div>

        {loading ? (
          <div className="text-slate-400 animate-pulse flex items-center justify-center h-64 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-lg font-medium">Loading your stats...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Completed Interviews</p>
                    <p className="text-2xl font-bold">{summary?.total_interviews || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Average Score</p>
                    <p className="text-2xl font-bold">{summary?.average_score != null ? `${summary.average_score}/10` : '--'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                   <p className="text-sm font-medium text-slate-400">Practice Time</p>
                   <p className="text-2xl font-bold">
                     {summary?.total_practice_time_minutes || 0} <span className="text-sm font-normal text-slate-500">mins</span>
                   </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Progress Graph */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold">Score Progression</h3>
                  </div>
                  
                  {chartData.length >= 1 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#64748b" 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                          />
                          <YAxis 
                            domain={[0, 10]} 
                            stroke="#64748b" 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#818cf8" 
                            strokeWidth={3}
                            dot={{ fill: '#1e1b4b', stroke: '#818cf8', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#818cf8', stroke: '#c7d2fe' }}
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                      <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
                      <p>Complete at least one interview to see your progress graph!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Recent History */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[400px]">
                <div className="p-6 border-b border-slate-800">
                  <h3 className="text-xl font-bold">Recent Interviews</h3>
                </div>
                
                <div className="flex-1 overflow-auto">
                  {history?.length > 0 ? (
                    <div className="divide-y divide-slate-800/50">
                      {history.map((session) => (
                        <div key={session.id} className="p-5 hover:bg-slate-800/20 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-slate-200">{session.interview_type}</p>
                              <p className="text-xs text-slate-500 mt-1">{new Date(session.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium">
                              {session.difficulty}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm font-medium">
                              {session.status === 'completed' ? (
                                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                                  Score: {session.overall_score}/10
                                </span>
                              ) : (
                                <span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                                  In Progress
                                </span>
                              )}
                            </span>
                            
                            {session.status === 'completed' ? (
                              <button
                                onClick={() => navigate(`/interview/${session.id}/report`)}
                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                              >
                                View Report &rarr;
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate(`/interview/${session.id}`)}
                                className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                              >
                                Continue &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 h-full flex flex-col justify-center">
                      <p>You haven't completed any interviews yet.</p>
                      <button onClick={() => navigate('/resume')} className="text-indigo-400 mt-3 font-medium hover:underline">
                        Start your first session
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
