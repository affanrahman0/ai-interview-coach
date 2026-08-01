// PHASE 5: Dashboard - summary stats + interview history.

// import { useState, useEffect } from 'react'
// import MainLayout from '../layouts/MainLayout'
// import { getDashboardSummary, getInterviewHistory } from '../services/dashboardService'
//
// function Dashboard() {
//   const [summary, setSummary] = useState(null)
//   const [history, setHistory] = useState([])
//
//   useEffect(() => {
//     getDashboardSummary().then(setSummary)
//     getInterviewHistory().then(setHistory)
//   }, [])
//
//   return (
//     <MainLayout>
//       <h1 className="text-xl font-bold mb-4">Dashboard</h1>
//
//       {summary && (
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <div className="border p-4 rounded">Total Interviews: {summary.total_interviews}</div>
//           <div className="border p-4 rounded">Average Score: {summary.average_score}</div>
//           <div className="border p-4 rounded">Best Score: {summary.best_score}</div>
//         </div>
//       )}

//       {/* PHASE 5: Progress graph goes here (recharts / chart.js) */}
//
//       <h2 className="font-semibold mb-2">Past Interviews</h2>
//       <ul className="divide-y">
//         {history.map((interview) => (
//           <li key={interview.id} className="py-2">
//             {interview.interview_type} - {interview.difficulty} - {interview.status}
//           </li>
//         ))}
//       </ul>
//     </MainLayout>
//   )
// }
//
// export default Dashboard
