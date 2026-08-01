// PHASE 1: Top navigation bar.

// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'
//
// function Navbar() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//
//   function handleLogout() {
//     logout()
//     navigate('/login')
//   }
//
//   return (
//     <nav className="flex items-center justify-between px-6 py-4 border-b">
//       <Link to="/" className="font-bold text-lg">AI Interview Coach</Link>
//       <div className="flex gap-4">
//         <Link to="/resume">Resume</Link>
//         <Link to="/interview/new">New Interview</Link>
//         {user ? (
//           <button onClick={handleLogout}>Logout</button>
//         ) : (
//           <Link to="/login">Login</Link>
//         )}
//       </div>
//     </nav>
//   )
// }
//
// export default Navbar
