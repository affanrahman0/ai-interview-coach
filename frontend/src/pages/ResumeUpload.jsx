// PHASE 2: Resume upload / view / delete page.

// import { useState, useEffect } from 'react'
// import MainLayout from '../layouts/MainLayout'
// import { uploadResume, getResume, deleteResume } from '../services/resumeService'
//
// function ResumeUpload() {
//   const [resume, setResume] = useState(null)
//   const [file, setFile] = useState(null)
//
//   useEffect(() => {
//     getResume().then(setResume).catch(() => setResume(null))
//   }, [])
//
//   async function handleUpload(e) {
//     e.preventDefault()
//     if (!file) return
//     const data = await uploadResume(file)
//     setResume(data)
//   }
//
//   async function handleDelete() {
//     await deleteResume()
//     setResume(null)
//   }
//
//   return (
//     <MainLayout>
//       <h1 className="text-xl font-bold mb-4">Resume</h1>
//       {resume ? (
//         <div>
//           <p>Uploaded: {resume.file_url}</p>
//           <button onClick={handleDelete} className="text-red-600 underline mt-2">Delete</button>
//         </div>
//       ) : (
//         <form onSubmit={handleUpload} className="flex flex-col gap-3 max-w-sm">
//           <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
//           <button type="submit" className="bg-black text-white p-2 rounded">Upload</button>
//         </form>
//       )}
//     </MainLayout>
//   )
// }
//
// export default ResumeUpload
