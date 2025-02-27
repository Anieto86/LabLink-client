// import Login from '../../login'
// import FormTemplates from '../features/FormTemplates/FormTemplates'
import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const DashboardContainer = ({ children }: { children: ReactNode }) => (
  <div className="grid h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr] grid-areas-dashboard">{children}</div>
)

const Dashboard = () => {
  return (
    <DashboardContainer>
      {/* Sidebar */}
      <div className="grid-in-sidebar">
        <Sidebar />
      </div>

      {/* Header */}
      <div className="grid-in-header bg-lime-800">
        <Header />
      </div>

      {/* <Login />
      <FormTemplates /> */}
      {/* Main Content */}
      <div className="grid-in-main overflow-auto p-4">
        <Outlet />
      </div>
    </DashboardContainer>
  )
}

export default Dashboard
