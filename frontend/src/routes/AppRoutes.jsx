// PHASE 1: Central route definitions.
// Uncomment routes as each page is built.

import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
// import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
// import ResumeUpload from '../pages/ResumeUpload'
// import InterviewSetup from '../pages/InterviewSetup'
// import InterviewSession from '../pages/InterviewSession'
// import Report from '../pages/Report'
import ProtectedRoute from '../components/ProtectedRoute'
//
function AppRoutes() {
  return (
    <Routes>
      {/* PHASE 1: Auth */}
      <Route path="/login" element={<Login />} />
      
       {/* Protected Routes (Require Login) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default AppRoutes
