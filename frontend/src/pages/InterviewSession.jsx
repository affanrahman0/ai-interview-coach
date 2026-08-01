// PHASE 3: Question -> Answer -> Next Question loop.

// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import MainLayout from '../layouts/MainLayout'
// import { getInterview, submitAnswer, completeInterview } from '../services/interviewService'
//
// function InterviewSession() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [interview, setInterview] = useState(null)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [answerText, setAnswerText] = useState('')
//
//   useEffect(() => {
//     getInterview(id).then(setInterview)
//   }, [id])
//
//   if (!interview) return <MainLayout>Loading...</MainLayout>
//
//   const currentQuestion = interview.questions[currentIndex]
//   const isLastQuestion = currentIndex === interview.questions.length - 1
//
//   async function handleNext() {
//     await submitAnswer({ questionId: currentQuestion.id, text: answerText })
//     setAnswerText('')
//
//     if (isLastQuestion) {
//       await completeInterview(id) // PHASE 4
//       navigate(`/interview/${id}/report`)
//     } else {
//       setCurrentIndex((i) => i + 1)
//     }
//   }
//
//   return (
//     <MainLayout>
//       <p className="text-sm text-gray-500 mb-2">
//         Question {currentIndex + 1} of {interview.questions.length}
//       </p>
//       <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>
//       <textarea
//         value={answerText}
//         onChange={(e) => setAnswerText(e.target.value)}
//         rows={6}
//         className="border p-2 rounded w-full"
//         placeholder="Type your answer..."
//       />
//       <button onClick={handleNext} className="bg-black text-white p-2 rounded mt-4">
//         {isLastQuestion ? 'Finish Interview' : 'Next Question'}
//       </button>
//     </MainLayout>
//   )
// }
//
// export default InterviewSession
