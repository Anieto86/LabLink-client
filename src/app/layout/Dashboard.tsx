import React from 'react'
import { Suspense } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  return (
    <div className="grid-areas-dashboard">
      {/* Header */}
      <div className="grid-in-header">
        <Header />
      </div>

      {/* Sidebar */}
      <div className="grid-in-sidebar">
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="grid-in-main">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
