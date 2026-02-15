import { Outlet } from 'react-router-dom'
import { Suspense, useState } from 'react'
import Navbar from '@/features/navigation/components/Navbar'
import Sidebar from '@/features/navigation/components/Sidebar'
import '@/features/navigation/styles/Dashboard.css'

const AuthenticatedLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="grid-areas-dashboard">
      <div className="grid-in-navbar">
        <Navbar />
      </div>

      <div className={`grid-in-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar />
      </div>

      <div className="grid-in-main" onClick={() => setSidebarOpen(false)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default AuthenticatedLayout

