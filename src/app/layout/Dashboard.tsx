import React from 'react'
import './Dashboard.css'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Dashboard: React.FC = () => {
  return (
    <div className="grid-areas-dashboard">
      {/* Header */}
      <div className="grid-in-header">
        <Header />
      </div>

      {/* Sidebar */}
      <div className="grid-in-sidebar">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="grid-in-main">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
