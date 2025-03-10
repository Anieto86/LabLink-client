import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import Navbar from '@/app/features/navbar/Navbar'
import Sidebar from '@/app/layout/Sidebar'
import './Dashboard.css'

const AuthenticatedLayout = () => {
  return (
    <div className="grid-areas-dashboard">
      <div className="grid-in-navbar">
        <Navbar />
      </div>
      <div className="grid-in-sidebar">
        <Sidebar />
      </div>
      <div className="grid-in-main">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default AuthenticatedLayout
