import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from './Admin/AdminLayout'
import JobsManagement from './pages/JobsManagement/JobsManagement'
import Dashboard from './pages/DashBoard/Dashboard'
import TeamPage from './pages/TeamPage/TeamPage'
import Settings from './pages/Settings/Settings'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<AdminLayout />} >
          <Route index element={<Dashboard />} />
          <Route path='/users' element={<JobsManagement />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/team' element={<TeamPage />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
