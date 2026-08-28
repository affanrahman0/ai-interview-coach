import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary, getInterviewHistory } from '../services/dashboardService';
import { LogOut, PlusCircle, Clock, Award, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]); // Added state for the history!
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch BOTH endpoints at the same time
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
              <span className="text-slate-400">Welcome, {user?.name?.split(' ')[0]}</span>
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
          <div className="text-slate-400 animate-pulse">Loading your stats...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Completed Interviews</p>
                    <p className="text-2xl font-bold">{summary?.total_interviews || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Average Score</p>
                    {/* FIXED: average_score instead of avg_score */}
                    <p className="text-2xl font-bold">{summary?.average_score != null ? `${summary.average_score}/10` : '--'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                   <p className="text-sm text-slate-400">Practice Time</p>
<p className="text-2xl font-bold">
  {summary?.total_practice_time_minutes || 0} <span className="text-sm font-normal text-slate-400">mins</span>
</p>


                  </div>
                </div>
              </div>
            </div>

            {/* Recent History Table */}
            <h3 className="text-xl font-bold mb-4">Recent Interviews</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {history?.length > 0 ? (
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-800/50 text-slate-300">
                    <tr>
                      <th className="px-6 py-4 font-medium">Topic</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Score</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {/* FIXED: mapping over history instead of summary */}
                    {history.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{session.interview_type}</td>
                        <td className="px-6 py-4">{new Date(session.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md">
                            {/* FIXED: overall_score instead of score */}
                           {session.overall_score != null ? `${session.overall_score}/100` : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {session.status === 'completed' ? (
  <button
    onClick={() => navigate(`/interview/${session.id}/report`)}
    className="text-indigo-400 hover:text-indigo-300"
  >
    View Report
  </button>
) : (
  <button
    onClick={() => navigate(`/interview/${session.id}`)}
    className="text-amber-400 hover:text-amber-300 font-medium"
  >
    Continue
  </button>
)}

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p>You haven't completed any interviews yet.</p>
                  <button onClick={() => navigate('/resume')} className="text-indigo-400 mt-2 hover:underline">
                    Click here to start your first session
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
