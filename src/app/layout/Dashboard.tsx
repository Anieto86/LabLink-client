import { FormToolbox } from './FormToolbox'
import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  return (
    <div className="grid-areas-dashboard">
      {/* Header */}
      <header className="grid-in-header">
        <Header />
      </header>

      {/* Sidebar */}
      <aside className="grid-in-sidebar">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="grid-in-main">
        <Outlet />
      </main>

      <aside className="grid-in-formToolbox">
        <FormToolbox />
      </aside>
    </div>
  )
}

export default Dashboard
