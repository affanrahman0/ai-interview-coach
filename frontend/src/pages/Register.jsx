// PHASE 1: Registration page.

// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { registerUser } from '../services/authService'
//
// function Register() {
//   const [fullName, setFullName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const navigate = useNavigate()
//
//   async function handleSubmit(e) {
//     e.preventDefault()
//     try {
//       await registerUser({ fullName, email, password })
//       navigate('/login')
//     } catch (err) {
//       setError('Registration failed. Email may already be in use.')
//     }
//   }
//
//   return (
//     <div className="max-w-sm mx-auto mt-20">
//       <h1 className="text-xl font-bold mb-4">Create account</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//         <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border p-2 rounded" />
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" />
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button type="submit" className="bg-black text-white p-2 rounded">Register</button>
//       </form>
//       <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="underline">Login</Link></p>
//     </div>
//   )
// }
//
// export default Register
