// PHASE 1: Central route definitions.
// Uncomment routes as each page is built.

import { Routes, Route,Navigate  } from 'react-router-dom'
import Login from '../pages/Login'
// import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import ResumeUpload from '../pages/ResumeUpload'
import InterviewSetup from '../pages/InterviewSetup'
import InterviewSession from '../pages/InterviewSession'
import Report from '../pages/Report'
import ProtectedRoute from '../components/ProtectedRoute'
//
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PHASE 1: Auth */}
      <Route path="/login" element={<Login />} />
      
       {/* Protected Routes (Require Login) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/resume" element={
        <ProtectedRoute>
          <ResumeUpload />
        </ProtectedRoute>
      } />

      <Route path="/interview-setup" element={
        <ProtectedRoute>
          <InterviewSetup />
        </ProtectedRoute>
      } />
      <Route path="/interview/:id" element={
        <ProtectedRoute>
          <InterviewSession />
        </ProtectedRoute>
      } />
      <Route path="/interview/:id/report" element={
        <ProtectedRoute>
          <Report />
        </ProtectedRoute>
      } />



    </Routes>
  )
}

export default AppRoutes
