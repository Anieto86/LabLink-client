import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { Column, Row } from '@/app/components/design/Grid'
import Navbar from '@/app/features/navbar/Navbar'
import Sidebar from '@/app/layout/Sidebar'
import './Dashboard.css'

const AuthenticatedLayout = () => {
  const conditionalRednder = true
  return conditionalRednder ? (
    <div className="grid-areas-dashboard">
      <div className="grid-in-header">
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
  ) : (
    <Column className="w-full h-full items-center">
      <Navbar />
      <Row className="w-full h-full ">
        <Sidebar />
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </Row>
    </Column>
  )
}

export default AuthenticatedLayout
