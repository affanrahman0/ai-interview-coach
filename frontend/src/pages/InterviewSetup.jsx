// PHASE 3: Choose interview type, difficulty, number of questions -> start interview.

// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import MainLayout from '../layouts/MainLayout'
// import { startInterview } from '../services/interviewService'
//
// const TYPES = ['HR', 'DSA', 'Backend', 'Frontend', 'Python', 'Java', 'SQL', 'System Design']
// const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
// const QUESTION_COUNTS = [5, 10, 15]
//
// function InterviewSetup() {
//   const [interviewType, setInterviewType] = useState(TYPES[0])
//   const [difficulty, setDifficulty] = useState(DIFFICULTIES[0])
//   const [numQuestions, setNumQuestions] = useState(QUESTION_COUNTS[0])
//   const navigate = useNavigate()
//
//   async function handleStart() {
//     const interview = await startInterview({ interviewType, difficulty, numQuestions })
//     navigate(`/interview/${interview.id}`)
//   }
//
//   return (
//     <MainLayout>
//       <h1 className="text-xl font-bold mb-4">Start a new interview</h1>
//       <div className="flex flex-col gap-4 max-w-sm">
//         <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className="border p-2 rounded">
//           {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//         </select>
//         <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="border p-2 rounded">
//           {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
//         </select>
//         <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="border p-2 rounded">
//           {QUESTION_COUNTS.map((n) => <option key={n} value={n}>{n} questions</option>)}
//         </select>
//         <button onClick={handleStart} className="bg-black text-white p-2 rounded">Start Interview</button>
//       </div>
//     </MainLayout>
//   )
// }
//
// export default InterviewSetup
