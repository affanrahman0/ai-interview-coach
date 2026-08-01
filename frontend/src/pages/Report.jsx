// PHASE 4: Final interview report page.

// import { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import MainLayout from '../layouts/MainLayout'
// import { getReport } from '../services/interviewService'
//
// function Report() {
//   const { id } = useParams()
//   const [report, setReport] = useState(null)
//
//   useEffect(() => {
//     getReport(id).then(setReport)
//   }, [id])
//
//   if (!report) return <MainLayout>Loading report...</MainLayout>
//
//   return (
//     <MainLayout>
//       <h1 className="text-xl font-bold mb-4">Interview Report</h1>
//       <p className="mb-2">Overall Score: {report.overall_score}</p>
//
//       <h2 className="font-semibold mt-4">Strengths</h2>
//       <ul className="list-disc ml-6">{report.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
//
//       <h2 className="font-semibold mt-4">Weaknesses</h2>
//       <ul className="list-disc ml-6">{report.weaknesses.map((w) => <li key={w}>{w}</li>)}</ul>
//
//       <h2 className="font-semibold mt-4">Topics to Study</h2>
//       <ul className="list-disc ml-6">{report.topics_to_study.map((t) => <li key={t}>{t}</li>)}</ul>
//
//       {/* PHASE 6: Download report as PDF button */}
//     </MainLayout>
//   )
// }
//
// export default Report
